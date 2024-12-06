import "server-only";

import { db } from "./_db";
import { and, desc, eq, getTableColumns, isNotNull, isNull } from "drizzle-orm";
import {
  SiteMemberRole,
  SiteReport,
  SiteReportAll,
  SiteReportDetails,
  SiteReportDetailsNew,
  SiteReportNew,
  SiteReportSection,
  SiteReportSectionNew,
} from "@/lib/types/site";
import * as Schemas from "@/db/schema";

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
}): Promise<SiteMemberRole> {
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

export async function getMeetingRole({
  meetingId,
  userId,
}: {
  meetingId: number;
  userId: number;
}): Promise<SiteMemberRole> {
  return db
    .select({ role: Schemas.siteMembers1.role })
    .from(Schemas.siteMembers1)
    .leftJoin(
      Schemas.siteMeetings1,
      eq(Schemas.siteMeetings1.siteId, Schemas.siteMembers1.siteId),
    )
    .where(
      and(
        eq(Schemas.siteMeetings1.id, meetingId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function listSiteReports(
  siteId: number,
  includeUnpublished: boolean = false,
): Promise<SiteReport[]> {
  return db
    .select(SiteReportColumns)
    .from(Schemas.siteReports1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(
      and(
        eq(Schemas.siteReports1.siteId, siteId),
        includeUnpublished
          ? undefined
          : isNotNull(Schemas.siteReports1.publishedAt),
        isNull(Schemas.siteReports1.deletedAt),
      ),
    )
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
  includeUnpublished: boolean = false,
): Promise<SiteReportAll> {
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
    .where(
      and(
        eq(Schemas.siteReports1.id, reportId),
        includeUnpublished
          ? undefined
          : isNotNull(Schemas.siteReports1.publishedAt),
      ),
    )
    .limit(1)
    .then((r) => r[0]);
}

export async function addSiteReport(
  siteReport: SiteReportNew,
): Promise<SiteReportAll> {
  return db.transaction(async (tx) => {
    const fileGroup = await tx
      .insert(Schemas.fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const commentsSection = await tx
      .insert(Schemas.commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const report = await tx
      .insert(Schemas.siteReports1)
      .values({
        ...siteReport,
        fileGroupId: fileGroup.id,
        commentsSectionId: commentsSection.id,
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

export async function ensureSiteReportCommentsSection(reportId: number) {
  return db.transaction(async (tx) => {
    const { commentsSectionId } = await tx
      .select({ commentsSectionId: Schemas.siteReports1.commentsSectionId })
      .from(Schemas.siteReports1)
      .where(eq(Schemas.siteReports1.id, reportId))
      .then((r) => r[0]);

    if (commentsSectionId) return commentsSectionId;

    const commentsSection = await tx
      .insert(Schemas.commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const { commentsSectionId: commentsSectionId2 } = await tx
      .update(Schemas.siteReports1)
      .set({ commentsSectionId: commentsSection.id })
      .where(eq(Schemas.siteReports1.id, reportId))
      .returning()
      .then((r) => r[0]);

    return commentsSectionId2;
  });
}

export async function updateSiteReport(
  reportId: number,
  values: SiteReportNew,
): Promise<SiteReport> {
  return db
    .update(Schemas.siteReports1)
    .set(values)
    .where(eq(Schemas.siteReports1.id, reportId))
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteReportDetails(
  reportId: number,
  values: SiteReportDetailsNew,
): Promise<SiteReportDetails> {
  return db
    .update(Schemas.siteReportDetails1)
    .set(values)
    .where(eq(Schemas.siteReportDetails1.id, reportId))
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteReport(
  reportId: number,
): Promise<SiteReportAll> {
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

export async function listSiteReportSections(
  reportId: number,
): Promise<SiteReportSection[]> {
  return db
    .select()
    .from(Schemas.siteReportSections1)
    .where(eq(Schemas.siteReportSections1.reportId, reportId))
    .orderBy(Schemas.siteReportSections1.id);
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
  title?: string;
  content?: string;
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

export async function updateSiteReportSection(
  sectionId: number,
  values: SiteReportSectionNew,
): Promise<SiteReportSection> {
  return db
    .update(Schemas.siteReportSections1)
    .set(values)
    .where(eq(Schemas.siteReportSections1.id, sectionId))
    .returning()
    .then((r) => r[0]);
}
