"use server";

import * as db from "@/lib/db";
import * as Schemas from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { defaulTaskSpecs } from "content/tasks";
import { DesignTaskSpec } from "@/lib/types";

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
