import "server-only";

import { db } from "./_db";
import { eq, getTableColumns, isNull, and, isNotNull } from "drizzle-orm";
import { HaruFile, HaruFileNew } from "@/lib/types";
import {
  files1,
  users1,
  fileGroupFiles1,
  siteReports1,
  siteReportSections1,
} from "@/db/schema";

const HaruFileColumns = {
  ...getTableColumns(files1),
  uploader: {
    ...getTableColumns(users1),
  },
};

export async function getFile(fileId: number): Promise<HaruFile> {
  return await db
    .select(HaruFileColumns)
    .from(files1)
    .leftJoin(users1, eq(users1.id, files1.uploaderId))
    .where(eq(files1.id, fileId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addFileToGroup(groupId: number, values: HaruFileNew) {
  const newFile = await db.transaction(async (tx) => {
    const f = await tx
      .insert(files1)
      .values(values)
      .returning()
      .then((r) => r[0]);
    // should fail if groupId doesn't exist
    const x = await tx
      .insert(fileGroupFiles1)
      .values({ fileGroupId: groupId, fileId: f.id });
    return f;
  });
  return getFile(newFile.id);
}

export async function updateFile(
  { fileId }: { fileId: number },
  values: HaruFileNew,
) {
  return await db
    .update(files1)
    .set(values)
    .where(eq(files1.id, fileId))
    .returning()
    .then((r) => r[0]);
}

export async function getFilesFromGroup(
  fileGroupId: number,
): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(files1)
    .leftJoin(users1, eq(users1.id, files1.uploaderId))
    .leftJoin(fileGroupFiles1, eq(fileGroupFiles1.fileId, files1.id))
    .where(
      and(
        eq(fileGroupFiles1.fileGroupId, fileGroupId),
        isNull(files1.deletedAt),
      ),
    );
}

export async function getFilesForReport(
  reportId: number,
  includeUnpublished: boolean = false,
): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(files1)
    .leftJoin(users1, eq(users1.id, files1.uploaderId))
    .innerJoin(fileGroupFiles1, eq(fileGroupFiles1.fileId, files1.id))
    .innerJoin(
      siteReports1,
      eq(siteReports1.fileGroupId, fileGroupFiles1.fileGroupId),
    )
    .where(
      and(
        includeUnpublished ? undefined : isNotNull(siteReports1.publishedAt),
        eq(siteReports1.id, reportId),
        isNull(files1.deletedAt),
      ),
    );
}

export async function getFilesForReportSection(
  sectionId: number,
  includeUnpublished: boolean = false,
): Promise<HaruFile[]> {
  return db
    .select(HaruFileColumns)
    .from(files1)
    .leftJoin(users1, eq(users1.id, files1.uploaderId))
    .innerJoin(fileGroupFiles1, eq(fileGroupFiles1.fileId, files1.id))
    .innerJoin(
      siteReportSections1,
      eq(siteReportSections1.fileGroupId, fileGroupFiles1.fileGroupId),
    )
    .innerJoin(siteReports1, eq(siteReports1.id, siteReportSections1.reportId))
    .where(
      and(
        includeUnpublished ? undefined : isNotNull(siteReports1.publishedAt),
        eq(siteReportSections1.id, sectionId),
        isNull(files1.deletedAt),
      ),
    );
}
