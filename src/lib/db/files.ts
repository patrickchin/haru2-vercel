import "server-only";

import { db } from "./_db";
import { eq, getTableColumns } from "drizzle-orm";
import { HaruFile, HaruFileNew } from "@/lib/types";
import {
  fileGroupFiles1,
  files1,
  filesUsers1,
  siteReports1,
  siteReportSections1,
  users1,
} from "@/drizzle/schema";
import { unescape } from "querystring";

export async function getFile(fileId: number): Promise<HaruFile> {
  return db
    .select()
    .from(filesUsers1)
    .where(eq(filesUsers1.id, fileId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addFileToGroup(
  groupId: number,
  values: HaruFileNew,
): Promise<HaruFile> {
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
  fileId: number,
  values: HaruFileNew,
): Promise<HaruFile> {
  return db
    .update(files1)
    .set(values)
    .where(eq(files1.id, fileId))
    .returning()
    .then((r) => r[0]);
}

export async function listGroupFiles(fileGroupId: number): Promise<HaruFile[]> {
  return db
    .select()
    .from(filesUsers1)
    .where(eq(filesUsers1.fileGroupId, fileGroupId));
}

export async function listReportFiles(reportId: number): Promise<HaruFile[]> {

  const a = db.select()
    .from(filesUsers1)
    .innerJoin(
      siteReports1,
      eq(siteReports1.fileGroupId, filesUsers1.fileGroupId),
    )
    .where(eq(siteReports1.id, reportId))
    .toSQL().sql;
    console.log(unescape(a));

  throw Error("alskdjf");

  return db
    .select()
    .from(filesUsers1)
    .innerJoin(
      siteReports1,
      eq(siteReports1.fileGroupId, filesUsers1.fileGroupId),
    )
    .where(eq(siteReports1.id, reportId));
}

export async function getFilesForReportSection(
  sectionId: number,
): Promise<HaruFile[]> {
  return db
    .select()
    .from(filesUsers1)
    .innerJoin(
      siteReportSections1,
      eq(siteReportSections1.fileGroupId, fileGroupFiles1.fileGroupId),
    )
    .where(eq(siteReportSections1.id, sectionId));
}
