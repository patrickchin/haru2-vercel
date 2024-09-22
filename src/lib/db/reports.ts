import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import {
  SiteReport,
  SiteReportDetails,
  SiteReportNew,
  SiteReportSection,
} from "@/lib/types/site";
import * as Schemas from "@/drizzle/schema";

const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

const SiteReportColumns = {
  ...getTableColumns(Schemas.siteReports1),
  reporter: {
    ...getTableColumns(Schemas.users1),
  },
};

const SiteReportDetailsColumns = {
  ...SiteReportColumns,
  ...getTableColumns(Schemas.siteReportDetails1),
};

export async function getReportRole({
  reportId,
  userId,
}: {
  reportId: number;
  userId: number;
}) {
  return db
    .select({ role: Schemas.siteMembers1.role })
    .from(Schemas.siteMembers1)
    .leftJoin(
      Schemas.siteReports1,
      eq(Schemas.siteReports1.siteId, Schemas.siteMembers1.siteId),
    )
    .where(
      and(
        eq(Schemas.siteReports1.id, reportId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function getSiteReports(siteId: number): Promise<SiteReport[]> {
  return db
    .select(SiteReportColumns)
    .from(Schemas.siteReports1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(eq(Schemas.siteReports1.siteId, siteId))
    .orderBy(desc(Schemas.siteReports1.id));
}

export async function getSiteReport(reportId: number): Promise<SiteReport> {
  return db
    .select(SiteReportColumns)
    .from(Schemas.siteReports1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(eq(Schemas.siteReports1.id, reportId))
    .limit(1)
    .then((r) => r[0]);
}

export async function getSiteReportDetails(
  reportId: number,
): Promise<SiteReportDetails> {
  return db
    .select(SiteReportDetailsColumns)
    .from(Schemas.siteReports1)
    .innerJoin(
      Schemas.siteReportDetails1,
      eq(Schemas.siteReportDetails1.id, Schemas.siteReports1.id),
    )
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(eq(Schemas.siteReports1.id, reportId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addSiteReport(
  siteReport: SiteReportNew,
): Promise<SiteReportDetails> {
  return db.transaction(async (tx) => {
    const fileGroup = await tx
      .insert(Schemas.fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const report = await tx
      .insert(Schemas.siteReports1)
      .values({
        ...siteReport,
        fileGroupId: fileGroup.id,
      })
      .returning()
      .then((r) => r[0]);

    const details = await tx
      .insert(Schemas.siteReportDetails1)
      .values({ id: report.id })
      .returning()
      .then((r) => r[0]);

    return { ...report, ...details };
  });
}

export async function deleteSiteReport(
  reportId: number,
): Promise<SiteReportDetails> {
  return db.transaction(async (tx) => {
    const report = await tx
      .delete(Schemas.siteReports1)
      .where(eq(Schemas.siteReports1.id, reportId))
      .returning()
      .then((r) => r[0]);
    const details = await tx
      .delete(Schemas.siteReportDetails1)
      .where(eq(Schemas.siteReportDetails1.id, reportId))
      .returning()
      .then((r) => r[0]);
    return { ...report, ...details };
  });
}

// ============================================================================

export async function getReportSectionRole({
  sectionId,
  userId,
}: {
  sectionId: number;
  userId: number;
}) {
  return db
    .select({ role: Schemas.siteMembers1.role })
    .from(Schemas.siteMembers1)
    .leftJoin(
      Schemas.siteReports1,
      eq(Schemas.siteReports1.siteId, Schemas.siteMembers1.siteId),
    )
    .leftJoin(
      Schemas.siteReportSections1,
      eq(Schemas.siteReportSections1.reportId, Schemas.siteReports1.id),
    )
    .where(
      and(
        eq(Schemas.siteReportSections1.id, sectionId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function getSiteReportSections(
  reportId: number,
): Promise<SiteReportSection[]> {
  return db
    .select()
    .from(Schemas.siteReportSections1)
    .where(eq(Schemas.siteReportSections1.reportId, reportId));
}

export async function getSiteReportSection(
  sectionId: number,
): Promise<SiteReportSection> {
  return db
    .select()
    .from(Schemas.siteReportSections1)
    .where(eq(Schemas.siteReportSections1.id, sectionId))
    .then((r) => r[0]);
}

export async function addSiteReportSection(values: {
  reportId: number;
  title: string;
  content: string;
}) {
  return db.transaction(async (tx) => {
    const fileGroup = await tx
      .insert(Schemas.fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const section = await tx
      .insert(Schemas.siteReportSections1)
      .values({
        ...values,
        fileGroupId: fileGroup.id,
      })
      .returning()
      .then((r) => r[0]);

    return section;
  });
}
