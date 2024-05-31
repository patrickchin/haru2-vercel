"use server";

import * as db from "@/lib/db";
import * as Schemas from "@/drizzle/schema";
import { signIn } from "@/lib/auth";
import { auth } from "./auth";
import * as blob from "@vercel/blob";
import {
  DesignTaskSpec,
  NewProjectFormSchema,
  RegisterSchemaType,
} from "./types";
import { redirect } from "next/navigation";
import { defaulTaskSpecs } from "content/tasks";
import assert from "assert";

const VERCEL_BLOB_FAKE_FILES = false;

export async function registerUser(data: RegisterSchemaType) {
  try {
    await db.createUserIfNotExists(data);
  } catch (error) {
    throw error;
  }
}

export async function signInFromLogin(data: any) {
  // TODO validate
  return await signIn("credentials", data);
}

export async function submitProjectForm2(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("Invalid session on project form submit");
    return null;
  }
  const userId = Number(session.user.id); // error?

  const formObj = {
    ...Object.fromEntries(formData),
    files: formData.getAll("files"),
  };
  const parsed = NewProjectFormSchema.safeParse(formObj);
  if (!parsed.success) {
    console.error("submitProjectForm validation error", parsed.error);
    return null;
  }

  // not the prettiest ...
  const {
    files,
    title,
    description,
    buildingType,
    buildingSubtype,
    country,
    ...extrainfo
  } = parsed.data;

  const project = await db.createProject({
    userid: userId,
    title,
    description,
    type: buildingType,
    subtype: buildingSubtype,
    countrycode: country,
    extrainfo,
  });

  const results = Array.from(files ?? []).map(async (file) => {
    // HACK FormData constructor from event.target adds a file with no filename ignore that file here.
    if (file.name == "undefined" && file.size == 0) {
      console.log("ignoring fake file from FormData constructor");
      return Promise.resolve();
    }

    console.log(`uploading file "${file.name}"`);
    const data = await file.arrayBuffer();
    const { url, downloadUrl } = await blob.put(
      `project/${project.id}/${file.name}`,
      data,
      { access: "public" },
    );
    console.log(
      `file "${file.name}" uploaded to: ${url}\n` +
        `    and can be downloaded from: ${downloadUrl}`,
    );

    const newFileRow = await db.addFile({
      uploaderid: userId,
      projectid: project.id,
      filename: file.name,
      url: url,
      type: file.type,
    });
  });

  Promise.all(results).catch((e) => {
    console.error("Failed to upload all files.");
  });

  redirect(`/project/${project.id}`);
}

export async function getProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  return await db.getProject(projectId);
}

export async function deleteFullProject(projectId: number) {
  // disable deletions for now
  return;

  // TODO needs more security
  const session = await auth();
  if (!session?.user?.id) return;

  // A lot more thought has to go into deleting projects.
  // - what happens if something fails in the middle?
  // - what happens if ... what else?

  console.log("DELETING PROJECT", projectId);

  const deletedFiles = await db.deleteAllFilesFromProject(projectId);
  deletedFiles.map((f) => {
    console.log("deleting file from store", f);
    if (f.url) blob.del(f.url);
  });

  const deletedProject = await db.deleteProject(projectId);
  console.log("DELETED PROJECT", deletedProject);

  redirect("/projects");
}

export async function startProject(
  projectId: number,
  taskSpecSelection: Record<number, boolean>,
) {
  const newTasks = await createProjectTasks(projectId, taskSpecSelection);
  if (!newTasks || newTasks.length == 0)
    console.error("Failed to create project tasks");
  await updateProject(projectId, { status: "in progress" });
}

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return db.getFilesForProject(projectId);
}

//Update project title
export async function updateProjectTitle(projectId: number, newTitle: string) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Invalid session on project form submit");
    return null;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("User ID is not a number:", session.user.id);
    return null;
  }

  const updatedProject = await db.updateProjectFields(projectId, {
    title: newTitle,
  });
  if (!updatedProject) {
    console.error("Failed to update project title.");
    return null;
  }
  return updatedProject;
}

export async function getCurrentUsersProjects() {
  const session = await auth();
  if (session?.user?.id) // linter is stupid
    return db.getUserProjects(parseInt(session.user.id));
}

//update any field of the project
export async function updateProject(
  projectId: number,
  updates: Record<string, any>,
) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Invalid session on project form submit");
    return null;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("User ID is not a number:", session.user.id);
    return null;
  }

  const updatedProject = await db.updateProjectFields(projectId, updates);
  if (!updatedProject) {
    console.error("Failed to update project title.");
    return null;
  }
  return updatedProject;
}

// members ===================================================================

export async function deleteProjectTeam(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.deleteTeam(teamId);
}

export async function getProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getProjectTeamsEnsureDefault(projectId);
}

export async function addTeamMember(teamId: number, email: string) {
  const session = await auth();
  if (!session?.user) return;
  const newTeamMember = await db.addTeamMemberByEmail(teamId, email);
  return db.getTeamMembersDetailed(teamId);
}

export async function getTeamMembersDetailed(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTeamMembersDetailed(teamId);
}

export async function getTeamMembers(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTeamMembers(teamId);
}

// tasks ===================================================================

async function getTaskSpecsInternal() {
  const specs: DesignTaskSpec[] = await db.getTaskSpecs();
  if (specs.length > 0) return specs;
  console.log("Creating default task specifications");
  return db.createTaskSpecs(defaulTaskSpecs);
}

export async function getTaskSpecs() {
  const session = await auth();
  if (!session?.user) return;
  return getTaskSpecsInternal();
}

export async function getTaskSpec(specId: number) {
  const session = await auth();
  if (!session?.user) return;
  const specs = await db.getTaskSpec(specId);
  if (specs.length <= 0) return;
  return specs[0];
}

export async function getProjectTaskSpecsGroupedByTeam() {
  const specs: DesignTaskSpec[] = await getTaskSpecsInternal();
  const groupedSpecs: Record<string, DesignTaskSpec[]> = {};
  specs.forEach((spec) => {
    const key: string = spec.type || "other";
    if (!Object.keys(groupedSpecs).includes(key)) groupedSpecs[key] = [];
    groupedSpecs[key].push(spec);
  });
  return groupedSpecs;
}

export async function createProjectTasks(
  projectId: number,
  enabled: Record<number, boolean>,
) {
  const session = await auth();
  if (!session?.user?.id) return;

  const tasks = await db.getProjectTasks(projectId);
  if (tasks.length > 0) return tasks;

  const specs = await getTaskSpecsInternal();
  if (specs.length === 0) {
    console.warn("no task specifications");
    return;
  }

  const newTasks = specs.map((spec): typeof Schemas.tasks1.$inferInsert => {
    return {
      specid: spec.id,
      projectid: projectId,
      type: spec.type,
      title: spec.title,
      description: spec.description,
      enabled: enabled ? enabled[spec.id] ?? true : true,
    };
  });
  return await db.createProjectTasks(newTasks);
}

export async function getProjectTasks(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const tasks = await db.getProjectTasks(projectId);
  return tasks;
}

export async function getProjectTask(projectId: number, specId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const tasks = await db.getProjectTask(projectId, specId);
  if (tasks.length <= 0) return;
  return tasks[0];
}

export async function getTaskCommentsAndFiles(taskId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const comments = db.getTaskComments(taskId);
  const files = db.getTaskCommentAttachments(taskId);
  return Promise.all([comments, files]);
}

export async function getTaskComments(taskId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const comments = db.getTaskComments(taskId);
  return comments;
}

export async function addTaskComment(
  taskId: number,
  comment: string,
  attachmentsIds: number[],
) {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = Number(session.user.id);
  const comments = await db.addTaskComment({
    taskid: taskId,
    userid: userId,
    comment: comment,
  });
  if (comments.length == 0) return;
  const editedFiles = attachmentsIds.map((fileid) =>
    db.editTaskFile(fileid, { commentid: comments[0].id }),
  );
  const allEditedFiles = await Promise.all(editedFiles);
  return getTaskCommentsAndFiles(taskId);
}

export async function addTaskFile(
  taskId: number,
  specId: number,
  data: FormData,
) {
  const file = data.get("file") as File;
  if (!file) {
    console.log("addTaskFile file not correcty uploaded");
    return;
  }

  const session = await auth();
  if (!session?.user?.id) return;
  const userId = Number(session.user.id); // error?

  const newFileP = db.addTaskFile({
    type: file.type,
    // projectid: ?,
    taskid: taskId,
    specid: specId,
    uploaderid: userId,
    // commentid: ?,
    filename: file.name,
    filesize: file.size,
    // url: ?,
  });

  const fileBytes =
    VERCEL_BLOB_FAKE_FILES && file.size > 512
      ? new ArrayBuffer(8)
      : await file.arrayBuffer();
  // I would prefer the file to be saved here:
  // const blobResult = await blob.put(`project/${projectId}/task/${taskSpecId}/${file.name}`, fileBytes, {
  const blobResult = await blob.put(`task/${taskId}/${file.name}`, fileBytes, {
    access: "public",
  });

  const newFile = await newFileP;
  const editedFile = await db.editTaskFile(newFile.id, { url: blobResult.url });
  assert(newFile.id === editedFile.id, "added and edited files differ");
  return editedFile;
}

export async function addTaskFileReturnAll(
  taskId: number,
  specId: number,
  data: FormData,
) {
  // no auth because done in addTaskFile
  await addTaskFile(taskId, specId, data);
  return db.getTaskFiles(taskId);
}

export async function updateAvatarForUser(data: FormData) {
  const file = data.get("file") as File;

  if (!file) {
    console.error("file not correcty uploaded");
    return;
  }
  if (file.size > 250000) {
    console.error("file size is too big", file);
    return;
  }

  const session = await auth();
  if (!session?.user) {
    console.log("No user session found");
    return;
  }

  const userId = Number(session.user.id); // error?
  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return;
  }

  const fileBytes = await file.arrayBuffer();

  const blobResult = await blob.put(`user/${userId}/${file.name}`, fileBytes, {
    access: "public",
  });

  //Start a database transaction
  const { initial, updated } = await db.updateUserAvatar(userId, {
    avatarUrl: blobResult.url,
  });

  if (initial && initial.avatarUrl) {
    await blob.del(initial.avatarUrl);
  }
  return updated;
}

export async function deleteAvatarForUser() {
  const session = await auth();
  if (!session?.user) {
    console.log("No user session found");
    return;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return;
  }

  const { initial, updated } = await db.deleteUserAvatar(userId);

  if (initial && initial.avatarUrl) {
    await blob.del(initial.avatarUrl);
  }
  return updated;
}

export async function getTaskFiles(taskId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return db.getTaskFiles(taskId);
}

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return db.deleteFile(fileId);
}
