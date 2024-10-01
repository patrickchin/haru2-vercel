import "server-only";

import { db } from "./_db";
import { eq, getTableColumns } from "drizzle-orm";
import { HaruFile, HaruFileNew } from "@/lib/types";
import * as Schemas from "@/drizzle/schema";

const HaruFileColumns = {
  ...getTableColumns(Schemas.files1),
  uploader: {
    ...getTableColumns(Schemas.users1),
  },
};

export async function getFile(fileId: number): Promise<HaruFile> {
  return await db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .where(eq(Schemas.files1.id, fileId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addFileToGroup(groupId: number, values: HaruFileNew) {
  const newFile = await db.transaction(async (tx) => {
    const f = await tx
      .insert(Schemas.files1)
      .values(values)
      .returning()
      .then((r) => r[0]);
    // should fail if groupId doesn't exist
    const x = await tx
      .insert(Schemas.fileGroupFiles1)
      .values({ fileGroupId: groupId, fileId: f.id });
    return f;
  });
  return getFile(newFile.id);
}

export async function updateFile(fileId: number, values: HaruFileNew) {
  return await db
    .update(Schemas.files1)
    .set(values)
    .where(eq(Schemas.files1.id, fileId))
    .returning()
    .then((r) => r[0]);
}

export async function getFilesFromGroup(
  fileGroupId: number,
): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .leftJoin(
      Schemas.fileGroupFiles1,
      eq(Schemas.fileGroupFiles1.fileId, Schemas.files1.id),
    )
    .where(eq(Schemas.fileGroupFiles1.fileGroupId, fileGroupId));
}

export async function getFilesForReport(reportId: number): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .innerJoin(
      Schemas.fileGroupFiles1,
      eq(Schemas.fileGroupFiles1.fileId, Schemas.files1.id),
    )
    .innerJoin(
      Schemas.siteReports1,
      eq(Schemas.siteReports1.fileGroupId, Schemas.fileGroupFiles1.fileGroupId),
    )
    .where(eq(Schemas.siteReports1.id, reportId));
}

export async function getFilesForReportSection(
  sectionId: number,
): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(Schemas.files1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderId))
    .innerJoin(
      Schemas.fileGroupFiles1,
      eq(Schemas.fileGroupFiles1.fileId, Schemas.files1.id),
    )
    .innerJoin(
      Schemas.siteReportSections1,
      eq(
        Schemas.siteReportSections1.fileGroupId,
        Schemas.fileGroupFiles1.fileGroupId,
      ),
    )
    .where(eq(Schemas.siteReportSections1.id, sectionId));
}
