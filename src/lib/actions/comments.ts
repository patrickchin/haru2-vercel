"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { DesignCommentSection, DesignProject } from "@/lib/types";

function canViewProjectTasks(
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

function canAddComment(
  session?: Session | null,
  commentSection?: DesignCommentSection,
) {
  // TODO
  return true;
}

function getCommentsAndFiles(section: DesignCommentSection) {
  const comments = db.getCommentSectionComments(section.id);
  const attachments = db.getFilesForCommentSection(section.id);
  return Promise.all([section, comments, attachments]);
}

export async function getProjectCommentsAndFiles(projectId: number) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (!canViewProjectTasks(session, project)) return;
  const section = await db.getProjectCommentSection(projectId);
  return getCommentsAndFiles(section);
}

export async function getTaskCommentsAndFiles(taskId: number) {
  const session = await auth();
  const task = await db.getTask(taskId);
  if (!task.projectid) return;
  const project = await db.getProject(task.projectid);
  if (!canViewProjectTasks(session, project)) return;

  const sectionId = await db.getTaskCommentSection(taskId);
  return getCommentsAndFiles(sectionId);
}

export async function getTaskComments(taskId: number) {
  const session = await auth();
  const task = await db.getTask(taskId);
  if (!task.projectid) return;
  const project = await db.getProject(task.projectid);
  if (!canViewProjectTasks(session, project)) return;

  const comments = db.getTaskComments(taskId);
  return comments;
}

export async function addComment({
  commentSection,
  commentString,
  attachmentIds,
}: {
  commentSection: DesignCommentSection;
  commentString: string;
  attachmentIds: number[];
}) {
  const session = await auth();
  if (!canAddComment(session, commentSection)) return;

  const comment = await db.addSectionComment(commentSection.id, {
    userid: Number(session?.user?.id),
    comment: commentString,
  });
  // link files that have already been uploaded to the current comment
  const editedFiles = attachmentIds.map((fileid) =>
    db.updateFile(fileid, { commentid: comment.id }),
  );
  const allEditedFiles = await Promise.all(editedFiles);

  return getCommentsAndFiles(commentSection);
}