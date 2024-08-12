"use server";

import { auth } from "@/lib/auth";
import * as db from "@/lib/db";
import { deleteFileFromS3 } from "@/lib/s3";
import { Session } from "next-auth";
import { DesignFile, DesignProject } from "@/lib/types";
import assert from "assert";

function canViewProjectFiles(
  session?: Session | null,
  project?: DesignProject,
) {
  if (!project || !session?.user) return false;
  const isOwner = project?.userid === session.user.idn;
  switch (session.user.role) {
    case "client":
      return isOwner;
    case "designer":
      return true; // TODO only if my project manager is my manager
    case "manager":
      return true;
    case "admin":
      return true;
  }
}

function canEditProjectFiles(
  session?: Session | null,
  project?: DesignProject,
) {
  if (!project || !session?.user) return false;
  const isOwner = project?.userid === session.user.idn;
  switch (session.user.role) {
    case "client":
      return isOwner;
    case "designer":
      return true; // TODO only if my project manager is my manager
    case "manager":
      return true;
    case "admin":
      return true;
  }
}

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (!canViewProjectFiles(session, project)) return;

  return db.getFilesForProject(projectId);
}

export async function addFile(
  args: ({ projectId: number } | { taskId: number }) & {
    type: string;
    name: string;
    size: number;
    fileUrl: string;
  },
) {
  const session = await auth();

  // this is a bit more complicated than it should be
  const taskid = "taskId" in args ? args.taskId : null;
  let projectid = "projectId" in args ? args.projectId : null;
  assert(taskid || projectid);
  if (!projectid) {
    if (!taskid) return;
    const task = await db.getTask(taskid);
    if (!task.projectid) return;
    projectid = task.projectid;
  }
  const project = await db.getProject(projectid);
  if (!canEditProjectFiles(session, project)) return;

  return db.addFile({
    taskid,
    projectid,
    type: args.type,
    filename: args.name,
    filesize: args.size,
    url: args.fileUrl,
    // specid: specId,
    uploaderid: Number(session?.user?.id),
    // commentid: ?,
  });
}

export async function getTaskFiles(
  taskId: number,
): Promise<DesignFile[] | undefined> {
  const session = await auth();
  const task = await db.getTask(taskId);
  if (!task.projectid) return;
  const project = await db.getProject(task.projectid);
  if (!canViewProjectFiles(session, project)) return;

  return db.getFilesForTask(taskId);
}

export async function deleteFile(fileId: number) {
  const session = await auth();
  const file = await db.getFile(fileId);
  if (!file.projectid) {
    if (!file.taskid) return; // ?? then where does this file belong?
    const task = await db.getTask(file.taskid);
    if (!task.projectid) return;
    file.projectid = task.projectid; // kinda hacky
  }
  const project = await db.getProject(file.projectid);
  if (!canViewProjectFiles(session, project)) return;

  const f = await db.deleteFile(fileId);
  if (f.url) {
    // todo do this inside deleteFileFromS3
    const key = new URL(f.url).pathname.substring(1);
    deleteFileFromS3(key);
  }
  return f;
}

export async function addReportFile(args: {
  reportId: number;
  type: string;
  name: string;
  size: number;
  fileUrl: string;
}) {
  const session = await auth();
  // if (!canEditProjectFiles(session, project)) return;
  if (!session?.user) return; // TODO

  return db.addFile({
    reportId: args.reportId,
    type: args.type,
    filename: args.name,
    filesize: args.size,
    url: args.fileUrl,
    uploaderid: session.user.idn,
  });
}
