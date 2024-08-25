import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, asc, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import * as Schemas from "@/drizzle/schema";
import { DesignComment, DesignCommentNew } from "@/lib/types";

const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

const haruCommentColumns = {
  ...getTableColumns(Schemas.comments1),
  user: {
    ...getTableColumns(Schemas.users1),
  },
};

export async function getProjectCommentSection(projectId: number) {
  return await db.transaction(async (tx) => {
    const section = await tx
      .select()
      .from(Schemas.commentSections1)
      .where(eq(Schemas.commentSections1.projectid, projectId))
      .then((r) => (r.length > 0 ? r[0] : null));
    if (section) return section;
    return await tx
      .insert(Schemas.commentSections1)
      .values({ projectid: projectId })
      .returning()
      .then((r) => r[0]);
  });
}

export async function getTaskCommentSection(taskId: number) {
  return await db.transaction(async (tx) => {
    const section = await tx
      .select()
      .from(Schemas.commentSections1)
      .where(eq(Schemas.commentSections1.taskid, taskId))
      .then((r) => (r.length > 0 ? r[0] : null));
    if (section) return section;
    return await tx
      .insert(Schemas.commentSections1)
      .values({ taskid: taskId })
      .returning()
      .then((r) => r[0]);
  });
}

export async function getComment(commentid: number) {
  return await db
    .select(haruCommentColumns)
    .from(Schemas.comments1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.comments1.userid))
    .where(eq(Schemas.comments1.id, commentid))
    .limit(1)
    .then((r) => r[0]);
}

export async function getCommentSectionComments(
  sectionId: number,
): Promise<DesignComment[]> {
  return db
    .select(haruCommentColumns)
    .from(Schemas.comments1)
    .leftJoin(
      Schemas.commentSections1,
      eq(Schemas.commentSections1.id, Schemas.comments1.sectionId),
    )
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.comments1.userid))
    .where(eq(Schemas.commentSections1.id, sectionId))
    .orderBy(Schemas.comments1.id);
}

export async function getProjectComments(projectId: number) {
  const section = await getProjectCommentSection(projectId);
  return [section, getCommentSectionComments(section.id)];
}

export async function getTaskComments(taskid: number) {
  const section = await getTaskCommentSection(taskid);
  return [section, getCommentSectionComments(section.id)];
}

export async function addSectionComment(
  sectionId: number,
  value: Omit<typeof Schemas.comments1.$inferInsert, "id" | "sectionId">,
) {
  const c = await db
    .insert(Schemas.comments1)
    .values({
      ...value,
      sectionId,
    })
    .returning()
    .then((r) => r[0]);
  return getComment(c.id);
}

export async function addProjectComment(
  taskId: number,
  value: DesignCommentNew,
) {
  const section = await getProjectCommentSection(taskId);
  return addSectionComment(section.id, value);
}

export async function addTaskComment(
  taskId: number,
  value: DesignCommentNew,
) {
  const section = await getTaskCommentSection(taskId);
  return addSectionComment(section.id, value);
}
