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
import assert from "assert";
import {
  commentsSections1,
  equipment1,
  equipmentList1,
  fileGroups1,
  materials1,
  materialsList1,
  siteActivity1,
  siteActivityList1,
  siteInvitations1,
  siteMeetings1,
  siteMembers1,
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
  userId: number;
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

export async function getMeetingRole({
  meetingId,
  userId,
}: {
  meetingId: number;
  userId: number;
}): Promise<SiteMemberRole> {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .leftJoin(siteMeetings1, eq(siteMeetings1.siteId, siteMembers1.siteId))
    .where(
      and(eq(siteMeetings1.id, meetingId), eq(siteMembers1.memberId, userId)),
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
      .values({ id: report.id })
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
  userId: number;
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
  userId: number;
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

export async function listSiteReportInventoryMaterials(reportId: number) {
  return db
    .select()
    .from(materials1)
    .innerJoin(
      siteReportDetails1,
      eq(
        siteReportDetails1.inventoryMaterialsListId,
        materials1.materialsListId,
      ),
    )
    .where(eq(siteReportDetails1.id, reportId))
    .orderBy(materials1.id)
    .then((r) => r.map((m) => m.materials1));
}

export async function updateSiteReportInventoryMaterials(
  reportId: number,
  materials: SiteMaterialNew[],
) {
  return await db.transaction(async (tx) => {
    let inventoryMaterialsListId = await tx
      .select({ id: siteReportDetails1.inventoryMaterialsListId })
      .from(siteReportDetails1)
      .where(eq(siteReportDetails1.id, reportId))
      .limit(1)
      .then((r) => r[0].id);

    if (inventoryMaterialsListId) {
      await tx
        .delete(materials1)
        .where(eq(materials1.materialsListId, inventoryMaterialsListId));
    } else {
      inventoryMaterialsListId = await tx
        .insert(materialsList1)
        .values({})
        .returning()
        .then((r) => r[0].id);
      await tx
        .update(siteReportDetails1)
        .set({ inventoryMaterialsListId })
        .where(eq(siteReportDetails1.id, reportId))
        .returning();
    }

    assert(inventoryMaterialsListId);

    return tx
      .insert(materials1)
      .values(
        materials.map((m) => ({
          ...m,
          materialsListId: inventoryMaterialsListId,
        })),
      )
      .returning();
  });
}

export async function listSiteReportInventoryEquipment(reportId: number) {
  return db
    .select()
    .from(equipment1)
    .innerJoin(
      siteReportDetails1,
      eq(
        siteReportDetails1.inventoryEquipmentListId,
        equipment1.equipmentListId,
      ),
    )
    .where(eq(siteReportDetails1.id, reportId))
    .orderBy(equipment1.id)
    .then((r) => r.map((m) => m.equipments1));
}

export async function updateSiteReportInventoryEquipment(
  reportId: number,
  equipment: SiteEquipmentNew[],
) {
  return await db.transaction(async (tx) => {
    let inventoryEquipmentListId = await tx
      .select({ id: siteReportDetails1.inventoryEquipmentListId })
      .from(siteReportDetails1)
      .where(eq(siteReportDetails1.id, reportId))
      .limit(1)
      .then((r) => r[0].id);

    if (inventoryEquipmentListId) {
      await tx
        .delete(equipment1)
        .where(eq(equipment1.equipmentListId, inventoryEquipmentListId));
    } else {
      inventoryEquipmentListId = await tx
        .insert(equipmentList1)
        .values({})
        .returning()
        .then((r) => r[0].id);
      inventoryEquipmentListId = await tx
        .update(siteReportDetails1)
        .set({ inventoryEquipmentListId: inventoryEquipmentListId })
        .where(eq(siteReportDetails1.id, reportId))
        .returning()
        .then((r) => r[0].inventoryEquipmentListId);
    }

    assert(inventoryEquipmentListId);

    return tx
      .insert(equipment1)
      .values(
        equipment.map((m) => ({
          ...m,
          equipmentListId: inventoryEquipmentListId,
        })),
      )
      .returning();
  });
}

export async function getReportActivityRole({
  activityId,
  userId,
}: {
  activityId: number;
  userId: number;
}) {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .innerJoin(siteReports1, eq(siteReports1.siteId, siteMembers1.siteId))
    .innerJoin(siteReportDetails1, eq(siteReportDetails1.id, siteReports1.id))
    .innerJoin(
      siteActivityList1,
      eq(siteActivityList1.id, siteReportDetails1.siteActivityListId),
    )
    .innerJoin(
      siteActivity1,
      eq(siteActivity1.siteActivityListId, siteActivityList1.id),
    )
    .where(
      and(eq(siteActivity1.id, activityId), eq(siteMembers1.memberId, userId)),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function listSiteReportActivities(reportId: number) {
  return db
    .select()
    .from(siteActivity1)
    .innerJoin(
      siteActivityList1,
      eq(siteActivityList1.id, siteActivity1.siteActivityListId),
    )
    .innerJoin(
      siteReportDetails1,
      eq(siteReportDetails1.siteActivityListId, siteActivityList1.id),
    )
    .where(eq(siteReportDetails1.id, reportId))
    .orderBy(siteActivity1.id)
    .then((r) => r.map((m) => m.siteActivity1));
}

export async function addSiteActivity(
  reportId: number,
  activity: SiteActivityNew,
): Promise<SiteActivity> {
  return db.transaction(async (tx) => {
    let siteActivityListId = await tx
      .select({ id: siteReportDetails1.siteActivityListId })
      .from(siteReportDetails1)
      .where(eq(siteReportDetails1.id, reportId))
      .limit(1)
      .then((r) => r[0].id);

    if (!siteActivityListId) {
      siteActivityListId = await tx
        .insert(siteActivityList1)
        .values({})
        .returning()
        .then((r) => r[0].id);
      await tx
        .update(siteReportDetails1)
        .set({ siteActivityListId })
        .where(eq(siteReportDetails1.id, reportId))
        .returning();
    }

    return tx
      .insert(siteActivity1)
      .values({ ...activity, siteActivityListId })
      .returning()
      .then((r) => r[0]);
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
  return db
    .select()
    .from(materials1)
    .innerJoin(
      materialsList1,
      eq(materialsList1.id, materials1.materialsListId),
    )
    .innerJoin(
      siteActivity1,
      eq(siteActivity1.usedMaterialsListId, materialsList1.id),
    )
    .where(eq(siteActivity1.id, activityId))
    .orderBy(materials1.id)
    .then((r) => r.map((m) => m.materials1));
}

export async function updateSiteActivityUsedMaterials({
  activityId,
  materials,
}: {
  activityId: number;
  materials: SiteMaterialNew[];
}) {
  return await db.transaction(async (tx) => {
    let usedMaterialsListId = await tx
      .select({ id: siteActivity1.usedMaterialsListId })
      .from(siteActivity1)
      .where(eq(siteActivity1.id, activityId))
      .limit(1)
      .then((r) => r[0].id);

    if (usedMaterialsListId) {
      await tx
        .delete(materials1)
        .where(eq(materials1.materialsListId, usedMaterialsListId));
    } else {
      usedMaterialsListId = await tx
        .insert(materialsList1)
        .values({})
        .returning()
        .then((r) => r[0].id);
      await tx
        .update(siteActivity1)
        .set({ usedMaterialsListId })
        .where(eq(siteActivity1.id, activityId))
        .returning();
    }

    assert(usedMaterialsListId);

    return tx
      .insert(materials1)
      .values(
        materials.map((m) => ({ ...m, materialsListId: usedMaterialsListId })),
      )
      .returning();
  });
}

export async function listSiteActivityUsedEquipment(activityId: number) {
  return db
    .select()
    .from(equipment1)
    .innerJoin(
      equipmentList1,
      eq(equipmentList1.id, equipment1.equipmentListId),
    )
    .innerJoin(
      siteActivity1,
      eq(siteActivity1.usedEquipmentListId, equipmentList1.id),
    )
    .where(eq(siteActivity1.id, activityId))
    .orderBy(equipment1.id)
    .then((r) => r.map((m) => m.equipments1));
}

export async function updateSiteActivityUsedEquipment(
  activityId: number,
  equipment: SiteEquipmentNew[],
) {
  return await db.transaction(async (tx) => {
    let usedEquipmentListId = await tx
      .select({ id: siteActivity1.usedEquipmentListId })
      .from(siteActivity1)
      .where(eq(siteActivity1.id, activityId))
      .limit(1)
      .then((r) => r[0].id);

    if (usedEquipmentListId) {
      await tx
        .delete(equipment1)
        .where(eq(equipment1.equipmentListId, usedEquipmentListId));
    } else {
      usedEquipmentListId = await tx
        .insert(equipmentList1)
        .values({})
        .returning()
        .then((r) => r[0].id);
      await tx
        .update(siteActivity1)
        .set({ usedEquipmentListId })
        .where(eq(siteActivity1.id, activityId))
        .returning();
    }

    assert(usedEquipmentListId);

    return tx
      .insert(equipment1)
      .values(
        equipment.map((m) => ({ ...m, equipmentListId: usedEquipmentListId })),
      )
      .returning();
  });
}
