import "server-only";

import { db } from "./_db";
import { and, desc, eq, getTableColumns, isNotNull, isNull } from "drizzle-orm";
import {
  SiteActivity,
  SiteActivityNew,
  SiteEquipmentNew,
  SiteMaterialNew,
  SiteMemberRole,
  SiteReport,
  SiteReportAll,
  SiteReportDetails,
  SiteReportDetailsNew,
  SiteReportNew,
  SiteReportSection,
  SiteReportSectionNew,
} from "@/lib/types/site";
import {
  commentsSections1,
  equipment1,
  fileGroups1,
  materials1,
  siteActivity1,
  siteActivityEquipment1,
  siteActivityMaterials1,
  siteInvitations1,
  siteMembers1,
  siteReportActivity1,
  siteReportDetails1,
  siteReports1,
  siteReportSections1,
  users1,
} from "@/db/schema";

const SiteReportColumns = {
  ...getTableColumns(siteReports1),
  reporter: {
    ...getTableColumns(users1),
  },
};

const SiteReportDetailsColumns = {
  ...SiteReportColumns,
  ...getTableColumns(siteReportDetails1),
};

export async function getReportRole({
  reportId,
  userId,
}: {
  reportId: number;
  userId: string;
}): Promise<SiteMemberRole> {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .leftJoin(siteReports1, eq(siteReports1.siteId, siteMembers1.siteId))
    .where(
      and(eq(siteReports1.id, reportId), eq(siteMembers1.memberId, userId)),
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
    .from(siteReports1)
    .leftJoin(users1, eq(users1.id, siteReports1.reporterId))
    .where(
      and(
        eq(siteReports1.siteId, siteId),
        includeUnpublished ? undefined : isNotNull(siteReports1.publishedAt),
        isNull(siteReports1.deletedAt),
      ),
    )
    .orderBy(desc(siteReports1.id));
}

export async function getSiteReport(reportId: number): Promise<SiteReport> {
  return db
    .select(SiteReportColumns)
    .from(siteReports1)
    .leftJoin(users1, eq(users1.id, siteReports1.reporterId))
    .where(eq(siteReports1.id, reportId))
    .limit(1)
    .then((r) => r[0]);
}

export async function getSiteReportDetails(
  reportId: number,
  includeUnpublished: boolean = false,
): Promise<SiteReportAll> {
  return db
    .select(SiteReportDetailsColumns)
    .from(siteReports1)
    .innerJoin(siteReportDetails1, eq(siteReportDetails1.id, siteReports1.id))
    .leftJoin(users1, eq(users1.id, siteReports1.reporterId))
    .where(
      and(
        eq(siteReports1.id, reportId),
        includeUnpublished ? undefined : isNotNull(siteReports1.publishedAt),
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
      .insert(fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const commentsSection = await tx
      .insert(commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const report = await tx
      .insert(siteReports1)
      .values({
        ...siteReport,
        fileGroupId: fileGroup.id,
        commentsSectionId: commentsSection.id,
      })
      .returning()
      .then((r) => r[0]);

    const details = await tx
      .insert(siteReportDetails1)
      .values({ id: report.id, uuid: report.uuid })
      .returning()
      .then((r) => r[0]);

    return { ...report, ...details };
  });
}

export async function ensureSiteReportCommentsSection(reportId: number) {
  return db.transaction(async (tx) => {
    const { commentsSectionId } = await tx
      .select({ commentsSectionId: siteReports1.commentsSectionId })
      .from(siteReports1)
      .where(eq(siteReports1.id, reportId))
      .then((r) => r[0]);

    if (commentsSectionId) return commentsSectionId;

    const commentsSection = await tx
      .insert(commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const { commentsSectionId: commentsSectionId2 } = await tx
      .update(siteReports1)
      .set({ commentsSectionId: commentsSection.id })
      .where(eq(siteReports1.id, reportId))
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
    .update(siteReports1)
    .set(values)
    .where(eq(siteReports1.id, reportId))
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteReportDetails(
  reportId: number,
  values: SiteReportDetailsNew,
): Promise<SiteReportDetails> {
  return db
    .update(siteReportDetails1)
    .set(values)
    .where(eq(siteReportDetails1.id, reportId))
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteReport(
  reportId: number,
): Promise<SiteReportAll> {
  return db.transaction(async (tx) => {
    const report = await tx
      .delete(siteReports1)
      .where(eq(siteReports1.id, reportId))
      .returning()
      .then((r) => r[0]);
    const details = await tx
      .delete(siteReportDetails1)
      .where(eq(siteReportDetails1.id, reportId))
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
  userId: string;
}) {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .leftJoin(siteReports1, eq(siteReports1.siteId, siteMembers1.siteId))
    .leftJoin(
      siteReportSections1,
      eq(siteReportSections1.reportId, siteReports1.id),
    )
    .where(
      and(
        eq(siteReportSections1.id, sectionId),
        eq(siteMembers1.memberId, userId),
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
    .from(siteReportSections1)
    .where(eq(siteReportSections1.reportId, reportId))
    .orderBy(siteReportSections1.id);
}

export async function getSiteReportSection(
  sectionId: number,
): Promise<SiteReportSection> {
  return db
    .select()
    .from(siteReportSections1)
    .where(eq(siteReportSections1.id, sectionId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addSiteReportSection(values: {
  reportId: number;
  title?: string;
  content?: string;
}) {
  return db.transaction(async (tx) => {
    const fileGroup = await tx
      .insert(fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const section = await tx
      .insert(siteReportSections1)
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
    .update(siteReportSections1)
    .set(values)
    .where(eq(siteReportSections1.id, sectionId))
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteReportSection(sectionId: number) {
  return db.transaction(async (tx) => {
    const section = await tx
      .delete(siteReportSections1)
      .where(eq(siteReportSections1.id, sectionId))
      .returning()
      .then((r) => r[0]);

    if (section.fileGroupId) {
      const fileGroup = await tx
        .update(fileGroups1)
        .set({ deletedAt: new Date() })
        .where(eq(fileGroups1.id, section.fileGroupId))
        .returning()
        .then((r) => r[0]);
    }
  });
}

export async function getInvitationRole({
  invitationId,
  userId,
}: {
  invitationId: number;
  userId: string;
}): Promise<SiteMemberRole> {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .leftJoin(
      siteInvitations1,
      eq(siteInvitations1.siteId, siteMembers1.siteId),
    )
    .where(
      and(
        eq(siteInvitations1.id, invitationId),
        eq(siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function getReportActivityRole({
  activityId,
  userId,
}: {
  activityId: number;
  userId: string;
}) {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .innerJoin(siteReports1, eq(siteReports1.siteId, siteMembers1.siteId))
    .innerJoin(siteReportDetails1, eq(siteReportDetails1.id, siteReports1.id))
    .innerJoin(
      siteReportActivity1,
      eq(siteReportActivity1.siteReportId, siteReportDetails1.id),
    )
    .innerJoin(
      siteActivity1,
      eq(siteActivity1.id, siteReportActivity1.siteActivityId),
    )
    .where(
      and(eq(siteActivity1.id, activityId), eq(siteMembers1.memberId, userId)),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function listSiteReportActivities(reportId: number) {
  const columns = getTableColumns(siteActivity1);
  return db
    .select(columns)
    .from(siteActivity1)
    .innerJoin(
      siteReportActivity1,
      eq(siteReportActivity1.siteActivityId, siteActivity1.id),
    )
    .where(eq(siteReportActivity1.siteReportId, reportId))
    .orderBy(siteActivity1.id);
}

export async function getSiteReportActivity(activityId: number) {
  return db
    .select()
    .from(siteActivity1)
    .where(eq(siteActivity1.id, activityId))
    .limit(1)
    .then((r) => r[0]);
}

export async function addSiteActivity(
  reportId: number,
  activity: SiteActivityNew,
): Promise<SiteActivity> {
  return db.transaction(async (tx) => {
    const insertedActivity = await tx
      .insert(siteActivity1)
      .values(activity)
      .returning()
      .then((r) => r[0]);
    await tx.insert(siteReportActivity1).values({
      siteReportId: reportId,
      siteActivityId: insertedActivity.id,
    });
    return insertedActivity;
  });
}

export async function deleteSiteActivity(activityId: number) {
  return db
    .delete(siteActivity1)
    .where(eq(siteActivity1.id, activityId))
    .returning()
    .then((r) => r[0]);
  // what about usedMaterialsListId and usedEquipmentListId?
}

export async function updateSiteActivity(
  activityId: number,
  values: SiteActivityNew,
): Promise<SiteActivity> {
  return db
    .update(siteActivity1)
    .set(values)
    .where(eq(siteActivity1.id, activityId))
    .returning()
    .then((r) => r[0]);
}

export async function listSiteActivityUsedMaterials(activityId: number) {
  const columns = getTableColumns(materials1);
  return db
    .select(columns)
    .from(materials1)
    .innerJoin(
      siteActivityMaterials1,
      eq(siteActivityMaterials1.materialId, materials1.id),
    )
    .where(eq(siteActivityMaterials1.siteActivityId, activityId))
    .orderBy(materials1.id);
}

export async function updateSiteActivityUsedMaterials({
  activityId,
  materials,
}: {
  activityId: number;
  materials: SiteMaterialNew[];
}) {
  return await db.transaction(async (tx) => {
    const insertedMaterials = await tx
      .insert(materials1)
      .values(materials)
      .returning();
    await tx.insert(siteActivityMaterials1).values(
      insertedMaterials.map((m) => ({
        siteActivityId: activityId,
        materialsId: m.id,
      })),
    );
  });
}

export async function listSiteActivityUsedEquipment(activityId: number) {
  const columns = getTableColumns(equipment1);
  return db
    .select(columns)
    .from(equipment1)
    .innerJoin(
      siteActivityEquipment1,
      eq(siteActivityEquipment1.equipmentId, equipment1.id),
    )
    .where(eq(siteActivityEquipment1.siteActivityId, activityId))
    .orderBy(equipment1.id);
}

export async function updateSiteActivityUsedEquipment(
  activityId: number,
  equipment: SiteEquipmentNew[],
) {
  return await db.transaction(async (tx) => {
    const insertedEquipment = await tx
      .insert(equipment1)
      .values(equipment)
      .returning();
    await tx.insert(siteActivityEquipment1).values(
      insertedEquipment.map((e) => ({
        siteActivityId: activityId,
        materialsId: e.id,
      })),
    );
  });
}
