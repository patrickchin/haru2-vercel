"use server";

import * as db from "@/lib/db";
import * as Schemas from "@/drizzle/schema";
import { signIn } from "@/lib/auth";
import { auth } from "./auth";
import * as blob from "@vercel/blob";
import { deleteFileFromS3 } from "@/lib/s3";
import { DesignTaskSpec, defaultTeams } from "./types";
import {
  LoginTypesEmail,
  LoginTypesPassword,
  LoginTypesPhone,
  NewProjectFormSchema,
  RegisterSchema,
  RegisterSchemaType,
} from "./forms";
import { redirect } from "next/navigation";
import { defaulTaskSpecs } from "content/tasks";
import { AuthError } from "next-auth";
import assert from "assert";
import {
  CredentialsSigninError,
  InvalidInputError,
  UnknownError,
} from "./errors";

const VERCEL_BLOB_FAKE_FILES = false;

export async function getAllUsers() {
  const session = await auth();
  if (!session?.user?.id) return;
  // TODO separate users by organisation
  return db.getAllUsers();
}

export async function registerUser(data: RegisterSchemaType) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return InvalidInputError;
  }

  try {
    await db.createUserIfNotExists(data);
  } catch (error: unknown) {
    console.log(`Failed to register user ${error}`);
    return UnknownError;
  }
}

export async function signInFromLogin(
  data: LoginTypesPhone | LoginTypesEmail | LoginTypesPassword,
) {
  try {
    return await signIn("credentials", {
      ...data,
      redirectTo: "/",
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      // is there any need to distinguish further?
      // e.g. CredentialsSignin error
      return CredentialsSigninError;
    } else {
      throw error;
    }
  }
}

export async function submitProjectForm2(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("Invalid session on project form submit");
    return;
  }
  const userId = Number(session.user.id); // error?

  const formObj = {
    ...Object.fromEntries(formData),
    files: formData.getAll("files"),
  };
  const parsed = NewProjectFormSchema.safeParse(formObj);
  if (!parsed.success) {
    console.error("submitProjectForm validation error", parsed.error);
    return;
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

  Promise.all([
    db.createTeams(project.id, defaultTeams),
    db.createProjectTasksFromAllSpecs(project.id),
  ]);

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
    console.log(e);
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

export async function startProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  await updateProject(projectId, { status: "in progress" });
}

export async function startProjectForm(data: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const projectId = data.get("projectId") as unknown as number;
  if (isNaN(projectId)) return;

  await startProject(projectId);

  redirect(`/project/${projectId}`);
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
    return;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("User ID is not a number:", session.user.id);
    return;
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
  if (session?.user?.id)
    // linter is stupid
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

export async function createDefaultProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.createTeams(projectId, defaultTeams);
}

export async function createProjectTeam(projectId: number, type: string) {
  const session = await auth();
  if (!session?.user) return;
  return db.createTeam(projectId, type);
}

export async function deleteProjectTeam(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.deleteTeam(teamId);
}

export async function getProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return await db.getProjectTeams(projectId);
}

export async function setTeamLead(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.setTeamLead(teamId, userId);
}

export async function addTeamMember(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  const newTeamMember = await db.addTeamMember(teamId, userId);
  return db.getTeamMembersDetailed(teamId);
}

export async function removeTeamMember(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  const newTeamMember = await db.deleteTeamMember(teamId, userId);
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

export async function getTaskSpecsType(type: string) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTaskSpecsOfType(type);
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

// TODO remove?
export async function createProjectTasks(
  projectId: number,
  enabled?: Record<number, boolean>,
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

export async function enableProjectTaskSpec(
  projectId: number,
  specId: number,
  enabled: boolean,
) {
  const session = await auth();
  if (!session?.user?.id) return;
  const tasks = await db.enableProjectTaskSpec(projectId, specId, enabled);
  return tasks;
}

export async function enableProjectTask(taskId: number, enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) return;
  const task = await db.enableProjectTask(taskId, enabled);
  if (!task.projectid) return;
  if (!task.type) return;
  // tbh should this really be returning all of the tasks? ...
  return await db.getProjectTasksAllOfType(task.projectid, task.type);
}

// include disabled
export async function getProjectTasksAllOfType(
  projectId: number,
  type: string,
) {
  const session = await auth();
  if (!session?.user?.id) return;
  return await db.getProjectTasksAllOfType(projectId, type);
}

// include disabled
export async function getProjectTasksAll(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return await db.getProjectTasksAll(projectId);
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

export async function getTask(taskId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const tasks = await db.getTask(taskId);
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
  type: string,
  name: string,
  size: number,
  fileUrl: string,
) {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = Number(session.user.id); // error?

  return db.addTaskFile({
    taskid: taskId,
    type: type,
    filename: name,
    filesize: size,
    url: fileUrl,
    // specid: specId,
    uploaderid: userId,
    // commentid: ?,
  });
}

export async function updateAvatarForUser(fileUrl: string | null) {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = Number(session.user.id);

  try {
    const { initial, updated } = await db.updateUserAvatar(userId, {
      avatarUrl: fileUrl,
    });

    if (initial && initial.avatarUrl) {
      const key = new URL(initial.avatarUrl).pathname.substring(1);
      await deleteFileFromS3(key);
    }
    return updated;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    throw error;
  }
}

export async function getTaskFiles(taskId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return db.getFilesForTask(taskId);
}

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const f = await db.deleteFile(fileId);
  if (f.url) {
    // todo do this inside deleteFileFromS3
    const key = new URL(f.url).pathname.substring(1);
    deleteFileFromS3(key);
  }
  return f;
}
