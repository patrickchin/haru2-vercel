import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, or, getTableColumns } from "drizzle-orm";
import postgres from "postgres";

import * as Schemas from "@/drizzle/schema";
import { DesignFile, DesignFileNew } from "@/lib/types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

const HaruFileColumns = {
  ...getTableColumns(Schemas.files1),
  uploader: {
    ...getTableColumns(Schemas.users1),
  },
};

const HaruTaskFileColumns = {
  ...HaruFileColumns,
  task: {
    ...getTableColumns(Schemas.tasks1),
  },
};

export async function getFile(fileId: number): Promise<DesignFile> {
  return await db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .where(eq(Schemas.files1.id, fileId))
    .limit(1)
    .then((r) => r[0]);
}

export async function deleteFile(fileId: number): Promise<DesignFile> {
  const origf = await getFile(fileId);
  const delf = await db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.id, fileId))
    .returning()
    .then((r) => r[0]);
  return origf; // because this adds extra stuff
}

export async function addFile(values: DesignFileNew & { reportId?: number }) {
  const f = await db.transaction(async (tx) => {
    const f = await tx
      .insert(Schemas.files1)
      .values(values)
      .returning()
      .then((r) => r[0]);

    if (values.reportId) {
      await tx.insert(Schemas.siteReportFiles1).values({
        reportId: values.reportId,
        fileId: f.id,
      });
    }

    return f;
  });
  return getFile(f.id);
}

export async function getFilesForProject(projectId: number) {
  return await db
    .select(HaruTaskFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskId))
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .where(
      or(
        eq(Schemas.files1.projectId, projectId),
        eq(Schemas.tasks1.projectId, projectId),
      ),
    );
}

export async function deleteAllFilesFromProject(projectId: number) {
  return await db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.projectId, projectId))
    .returning();
}

export async function updateFile(fileId: number, values: DesignFileNew) {
  return await db
    .update(Schemas.files1)
    .set(values)
    .where(eq(Schemas.files1.id, fileId))
    .returning()
    .then((r) => r[0]);
}

export async function getFilesForTask(taskId: number) {
  return await db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .where(eq(Schemas.files1.taskId, taskId));
}

export async function getFilesForCommentSection(sectionId: number) {
  return db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .innerJoin(
      Schemas.comments1,
      eq(Schemas.comments1.id, Schemas.files1.uploaderId),
    )
    .innerJoin(
      Schemas.commentSections1,
      eq(Schemas.commentSections1.id, Schemas.comments1.sectionId),
    )
    .where(eq(Schemas.commentSections1.id, sectionId));
}

export async function addReportFile(reportId: number) {
  return await db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .leftJoin(
      Schemas.siteReportFiles1,
      eq(Schemas.siteReportFiles1.fileId, Schemas.files1.id),
    )
    .where(eq(Schemas.siteReportFiles1.reportId, reportId));
}

export async function getFilesForReport(reportId: number) {
  return await db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .leftJoin(
      Schemas.siteReportFiles1,
      eq(Schemas.siteReportFiles1.fileId, Schemas.files1.id),
    )
    .where(eq(Schemas.siteReportFiles1.reportId, reportId));
}
