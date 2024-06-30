"use server";

import { auth } from "@/lib/auth";
import * as db from "@/lib/db";
import { deleteFileFromS3 } from "@/lib/s3";

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  return db.getFilesForProject(projectId);
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