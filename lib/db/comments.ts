import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, asc, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import * as Schemas from "@/drizzle/schema";

const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

async function getProjectCommentSectionId(projectId: number) {
  return await db.transaction(async (tx) => {
    const { commentSectionsId } = await tx
      .select({ commentSectionsId: Schemas.projects1.commentsId })
      .from(Schemas.projects1)
      .where(eq(Schemas.projects1.id, projectId))
      .then((r) => r[0]);
    if (commentSectionsId) return commentSectionsId;
    const section = await tx
      .insert(Schemas.commentSections1)
      .values([{}])
      .returning()
      .then((r) => r[0]);
    await tx
      .update(Schemas.projects1)
      .set({ commentsId: section.id })
      .where(eq(Schemas.projects1.id, projectId))
      .then((r) => r[0]);
    return section.id;
  });
}

async function getTaskCommentSectionId(taskId: number) {
  return await db.transaction(async (tx) => {
    const { commentSectionsId } = await tx
      .select({ commentSectionsId: Schemas.tasks1.commentsId })
      .from(Schemas.tasks1)
      .where(eq(Schemas.tasks1.id, taskId))
      .then((r) => r[0]);
    if (commentSectionsId) return commentSectionsId;
    const section = await tx
      .insert(Schemas.commentSections1)
      .values([{}])
      .returning()
      .then((r) => r[0]);
    await tx
      .update(Schemas.tasks1)
      .set({ commentsId: section.id })
      .where(eq(Schemas.tasks1.id, taskId))
      .then((r) => r[0]);
    return section.id;
  });
}

export async function getTaskComment(commentid: number) {
  return await db
    .select()
    .from(Schemas.comments1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.comments1.userid))
    .where(eq(Schemas.comments1.id, commentid));
}

export async function getCommentSectionComments(sectionId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.comments1),
      user: {
        ...getTableColumns(Schemas.users1),
      },
    })
    .from(Schemas.commentSections1)
    .leftJoin(
      Schemas.comments1,
      eq(Schemas.comments1.sectionId, Schemas.commentSections1.id),
    )
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.comments1.userid))
    .where(eq(Schemas.commentSections1.id, sectionId))
    .orderBy(asc(Schemas.comments1.createdAt));
  // .limit(pagesize).offset(pagesize * pagenum)
}

export async function getProjectComments(projectId: number) {
  const sectionId = await getProjectCommentSectionId(projectId);
  return getCommentSectionComments(sectionId);
}

export async function getTaskComments(taskid: number) {
  const sectionId = await getTaskCommentSectionId(taskid);
  return getCommentSectionComments(sectionId);
}

export async function addSectionComment(
  sectionId: number,
  value: Omit<typeof Schemas.comments1.$inferInsert, "id" | "sectionId">,
) {
  return await db
    .insert(Schemas.comments1)
    .values({
      ...value,
      sectionId,
    })
    .returning();
}

export async function addProjectComment(
  taskId: number,
  value: Omit<typeof Schemas.comments1.$inferInsert, "id" | "sectionId">,
) {
  const sectionId = await getProjectCommentSectionId(taskId);
  return addSectionComment(sectionId, value);
}

export async function addTaskComment(
  taskId: number,
  value: Omit<typeof Schemas.comments1.$inferInsert, "id" | "sectionId">,
) {
  const sectionId = await getTaskCommentSectionId(taskId);
  return addSectionComment(sectionId, value);
}
