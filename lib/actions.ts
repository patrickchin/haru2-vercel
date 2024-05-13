"use server";

import * as db from "@/lib/db";
import * as Schemas from "drizzle/schema";
import { signIn } from "@/lib/auth";
import { auth } from "./auth";
import * as blob from "@vercel/blob";
import {
  DesignTaskSpec,
  DesignTeam,
  NewProjectFormSchema,
  RegisterSchemaType,
} from "./types";
import { redirect } from "next/navigation";
import { defaulTaskSpecs } from "./tasks";
import assert from "assert";
import { randomColor } from "./utils";

const VERCEL_BLOB_FAKE_FILES = true;

export async function registerUser(data: RegisterSchemaType) {
  try {
    let user = await db.getUser(data.email);

    if (user.length > 0) {
      throw new Error("User already exists");
    }

    await db.createUser(
      data.name,
      data.phone ?? "",
      data.email,
      data.password,
      randomColor,
    );
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

    lifestyle,
    future,
    energy,
    outdoors,
    security,
    maintenance,
    special,
  } = parsed.data;

  const newProjectArr = await db.createProject({
    userid: userId,
    title,
    description,
    type: buildingType,
    subtype: buildingSubtype,
    countrycode: country,
    extrainfo: {
      lifestyle,
      future,
      energy,
      outdoors,
      security,
      maintenance,
      special,
    },
  });

  if (newProjectArr.length === 0) {
    console.error("Failed to submit a new project post");
    return null;
  }

  const newProjectId = newProjectArr[0].id;

  // TODO client upload directly to server! 4.5 MB limit currently
  if (files) {
    for (const file of files) {
      // TODO hack
      // FormData constructor from event.target adds a file with no filename
      // ignore that file here
      // the improved file upload should not hit this error
      if (file.name == "undefined" && file.size == 0) {
        console.log("ignoring fake file from FormData constructor");
        continue;
      }

      const data =
        VERCEL_BLOB_FAKE_FILES && file.size > 512
          ? new ArrayBuffer(8)
          : await file.arrayBuffer();
      // TODO use all the data
      const { url } = await blob.put(
        `project/${newProjectId}/${file.name}`,
        data,
        {
          access: "public", // private access isn't supported by vercel atm
        },
      );
      console.log(`file "${file.name}" uploaded to: ${url}`);

      // TODO optimise - await outside the loop?
      const newFileRow = await db.addFileUrlToProject({
        uploaderid: userId,
        projectid: newProjectId,
        filename: file.name,
        url: url,
        type: file.type,
      });
      console.log(newFileRow.at(0)?.type);
    }
  }

  redirect(`/project/${newProjectId}`);
}

export async function getProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  const projects = await db.getProject(projectId);
  if (projects.length <= 0) return undefined;
  return projects[0];
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

export async function startProject(projectId: number) {
  const newTasks = await createProjectTasks(projectId);
  if (!newTasks || newTasks.length == 0) {
    console.error("Failed to create project tasks");
    // return null;
  }
  await updateProject(projectId, { status: "in progress" });
}

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  const fileUrls = await db.getFilesUrlsForProject(projectId);
  return fileUrls;
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

  const updatedProject = await db.updateTitle(projectId, newTitle);
  if (!updatedProject) {
    console.error("Failed to update project title.");
    return null;
  }
  return updatedProject;
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

export async function createProjectTeam(projectId: number, type: string) {
  const session = await auth();
  if (!session?.user) return;
  const newteam = await db.createTeam(projectId, type);
  assert(newteam?.length === 1, "Expected exactly one team should be added");
  return newteam;
}

export async function deleteProjectTeam(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  const deletedTeam: DesignTeam[] = await db.deleteTeam(teamId);
  assert(
    deletedTeam.length === 1,
    "Expected exactly one team should be deleted",
  );
  return deletedTeam;
}

export async function getProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getProjectTeams(projectId);
}

export async function addTeamMember(teamId: number, email: string) {
  const session = await auth();
  if (!session?.user) return;
  // TODO this can be done in one db call
  const user = await db.getUser(email);
  // TODO actually if the member doesn't exist we would like to add him anyways
  // and create an account for them
  if (user.length == 0) return;
  assert(user.length === 1, "Expected exactly one user with this email");
  const newTeamMember = await db.addTeamMember(teamId, user[0].id);
  assert(
    newTeamMember.length <= 1,
    "Expected exactly one or no users added to team",
  );
  return getTeamMembers(teamId);
}

export async function getTeamMembers(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTeamMembers(teamId);
}

// tasks ===================================================================

async function createDefaultTaskSpecs() {
  const session = await auth();
  if (!session?.user) return;
  const spec100 = await getTaskSpec(100);
  console.log("creating default task specs spec100", spec100);
  // TODO remove!!!!!!!!!!!!!
  // if (spec100) { db.TMPdeleteTaskSpecs(); }
  if (spec100) return;
  return db.createTaskSpecs(defaulTaskSpecs);
}

export async function getTaskSpec(specId: number | null) {
  if (specId === null) return;
  const specs = await db.getTaskSpec(specId);
  if (specs.length <= 0) return;
  return specs[0];
}

export async function getProjectTaskSpecsGroupedByTeam() {
  const specs: DesignTaskSpec[] = await db.getTaskSpecs();
  const groupedSpecs: Record<string, DesignTaskSpec[]> = {};
  specs.forEach((spec) => {
    const key: string = spec.type || "other";
    if (!Object.keys(groupedSpecs).includes(key)) groupedSpecs[key] = [];
    groupedSpecs[key].push(spec);
  });
  return groupedSpecs;
}

export async function createProjectTasks(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  // create defaults if not yet created
  await createDefaultTaskSpecs();

  // const userId = Number(session.user.id);
  // TODO check user permissions
  const specs = await db.getTaskSpecs();
  if (specs.length === 0) {
    console.warn("no task specifications");
    return;
  }

  const tasks = specs.map((spec): typeof Schemas.tasks1.$inferInsert => {
    return {
      specid: spec.id,
      projectid: projectId,
      type: spec.type,
      title: spec.title,
      description: spec.description,
    };
  });
  return await db.createProjectTasks(tasks);
}

export async function getProjectTasks(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  // const userId = Number(session.user.id);
  // TODO check user permissions
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

export async function addTaskFile(taskId: number, data: FormData) {
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

export async function addTaskFileReturnAll(taskId: number, data: FormData) {
  // no auth because done in addTaskFile
  await addTaskFile(taskId, data);
  return db.getTaskFiles(taskId);
}

//updateAvaterForUser
export async function updateAvaterForUser(data: FormData) {
  const file = data.get("file") as File;

  if (!file) {
    console.error("file not correcty uploaded");
    return;
  }
  if (file && file.size > 250000) {
    console.error("file size is too long");
    return;
  }

  const session = await auth();
  if (!session?.user?.id) return;
  const userId = Number(session.user.id); // error?

  const currentUser = await db.getUserAvater(userId);
  const oldAvatarUrl = currentUser.avatarUrl;

  const fileBytes = VERCEL_BLOB_FAKE_FILES
    ? new ArrayBuffer(8)
    : await file.arrayBuffer();

  const blobResult = await blob.put(`user/${userId}/${file.name}`, fileBytes, {
    access: "public",
  });

  await db.updateUserAvatarUrlToUser(userId, {
    avatarUrl: blobResult.url,
  });

  if (oldAvatarUrl) {
    await blob.del(oldAvatarUrl);
  }

  return blobResult.url;
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
