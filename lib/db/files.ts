import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import {
  and,
  eq,
  or,
  desc,
  asc,
  isNotNull,
  getTableColumns,
} from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

import * as Schemas from "@/drizzle/schema";
import assert from "assert";
import { defaultTeams } from "@/lib/types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);


export async function addFile(
  values: Omit<typeof Schemas.files1._.inferInsert, "id">,
) {
  return await db
    .insert(Schemas.files1)
    .values(values)
    .returning()
    .then((r) => r[0]);
}

export async function getFilesForProject(projectId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.files1),
      uploader: {
        ...getTableColumns(Schemas.users1),
      },
      task: {
        ...getTableColumns(Schemas.tasks1),
      },
    })
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskid))
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderid))
    .where(
      or(
        eq(Schemas.files1.projectid, projectId),
        eq(Schemas.tasks1.projectid, projectId),
      ),
    );
}

export async function deleteAllFilesFromProject(projectId: number) {
  return await db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.projectid, projectId))
    .returning();
}

// comments ==========================================================================================

export async function getTaskComment(commentid: number) {
  return await db
    .select()
    .from(Schemas.taskcomments1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.taskcomments1.userid),
    )
    .where(eq(Schemas.taskcomments1.id, commentid));
}

export async function getTaskComments(taskid: number, pagenum: number = 0) {
  const pagesize = 10;
  return await db
    .select({
      ...getTableColumns(Schemas.taskcomments1),
      user: {
        ...getTableColumns(Schemas.users1),
      },
    })
    .from(Schemas.taskcomments1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.taskcomments1.userid),
    )
    .where(eq(Schemas.taskcomments1.taskid, taskid))
    .orderBy(asc(Schemas.taskcomments1.createdAt));
  // .limit(pagesize).offset(pagesize * pagenum)
}

export async function addTaskComment(
  values: typeof Schemas.taskcomments1._.inferInsert,
) {
  return await db.insert(Schemas.taskcomments1).values(values).returning();
}

export async function addTaskFile(values: typeof Schemas.files1._.inferInsert) {
  const newFiles = await db.insert(Schemas.files1).values(values).returning();
  assert(newFiles.length == 1);
  return newFiles[0];
}

export async function editTaskFile(
  fileId: number,
  values: Omit<typeof Schemas.files1._.inferInsert, "id">,
) {
  const editedFiles = await db
    .update(Schemas.files1)
    .set(values)
    .where(eq(Schemas.files1.id, fileId))
    .returning();
  assert(editedFiles.length == 1);
  return editedFiles[0];
}

export async function getFilesForTask(taskId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.files1),
      uploader: {
        ...getTableColumns(Schemas.users1),
      },
      task: {
        ...getTableColumns(Schemas.tasks1),
      },
    })
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskid))
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderid))
    .where(eq(Schemas.tasks1.id, taskId));
}

export async function getTaskCommentAttachments(taskid: number) {
  return await db
    .select()
    .from(Schemas.files1)
    .where(
      and(
        eq(Schemas.files1.taskid, taskid),
        isNotNull(Schemas.files1.commentid),
      ),
    );
}

export async function deleteFile(fileId: number) {
  return db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.id, fileId))
    .returning()
    .then((r) => r[0]);
}

