"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/db";
import { auth } from "@/lib/auth";
import { HaruFileNew } from "@/lib/types/common";
import {
  SiteActivityNew,
  SiteEquipmentNew,
  SiteMaterialNew,
  SiteMemberRole,
  SiteReportDetailsNew,
  SiteReportNew,
  SiteReportSectionNew,
} from "@/lib/types/site";
import { viewSiteRoles, editReportRoles } from "@/lib/permissions";
import { getSiteMemberRole } from "@/lib/actions/sites";

export async function listSiteReports(siteId: number) {
  const role = await getSiteMemberRole({ siteId });
  if (editReportRoles.includes(role)) return db.listSiteReports(siteId, true);
  if (viewSiteRoles.includes(role)) return db.listSiteReports(siteId, false);
}

export async function getSiteReport(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role)) return db.getSiteReport(reportId, true);
  if (viewSiteRoles.includes(role)) return db.getSiteReport(reportId);
}

export async function getSiteReportDetails(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role))
    return db.getSiteReportDetails(reportId, true);
  if (viewSiteRoles.includes(role))
    return db.getSiteReportDetails(reportId, false);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (editReportRoles.includes(await getSiteMemberRole({ siteId }, session))) {
    const report = await db.addSiteReport({
      reporterId: session?.user?.id,
      siteId: siteId,
    });
    const reportId = report.id;
    db.addLogMessage({ message: "Site report added", reportId });
    return report;
  }
}

export async function updateSiteReport(
  reportId: number,
  values: Omit<SiteReportNew, "publishedAt">,
) {
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
    const report = await db.updateSiteReport(reportId, values);
    db.addLogMessage({ message: "Site report updated", reportId });
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return report;
  }
}

export async function updateSiteReportDetails(
  reportId: number,
  // TODO Pick instead of Omit?
  // or use for schemas directly
  values: Omit<
    SiteReportDetailsNew,
    | "supervisorId"
    | "supervisorSignDate"
    | "managerId"
    | "managerSignDate"
    | "contractorId"
    | "contractorSignDate"
  >,
) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const [details, report] = await Promise.all([
      db.updateSiteReportDetails(reportId, values),
      db.getSiteReport(reportId),
    ]);
    db.addLogMessage({ message: "Site report details updated", reportId });
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return { ...report, ...details };
  }
}

export async function publishReport(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const report = await db.updateSiteReport(reportId, {
      publishedAt: new Date(),
    });
    db.addLogMessage({ message: "Site report published", reportId });
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return report;
  }
}

export async function signReport(reportId: number, buttonRole: SiteMemberRole) {
  const session = await auth();
  if (!session?.user) return;
  const role = await getSiteMemberRole({ reportId }, session);
  if (role != buttonRole) return;

  const oldReport = await db.getSiteReportDetails(reportId);
  if (!oldReport.publishedAt) return;

  let signArgs: SiteReportDetailsNew = {};
  if (role === "supervisor") {
    signArgs = {
      supervisorId: session.user.id,
      supervisorSignDate: new Date(),
    };
  } else if (role === "manager") {
    signArgs = {
      contractorId: session.user.id,
      contractorSignDate: new Date(),
    };
  } else if (role === "contractor") {
    signArgs = {
      contractorId: session.user.id,
      contractorSignDate: new Date(),
    };
  } else if (role === "owner") {
    signArgs = {
      ownerId: session.user.id,
      ownerSignDate: new Date(),
    };
  }

  if (!signArgs) return;
  const report = await db.updateSiteReportDetails(reportId, signArgs);
  db.addLogMessage({ message: `Site report signed by ${role}`, reportId });
  revalidatePath(`/sites/${oldReport.siteId}/reports/${report.id}`);
  return report;
}

export async function deleteSiteReport(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const report = await db.getSiteReport(reportId);
    if (!report.publishedAt) {
      // const updatedReport = await db.deleteSiteReport(reportId);
      const updatedReport = db.updateSiteReport(reportId, {
        deletedAt: new Date(),
      });
      db.addLogMessage({ message: "Site report deleted", reportId });
      revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
      return updatedReport;
    }
  }
}

export async function listReportFiles(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  let report = null;
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role)) {
  //   report = await db.getSiteReport(reportId, true);
  // }
  if (viewSiteRoles.includes(role)) {
    report = await db.getSiteReport(reportId);
  }
  if (report?.fileGroupId) {
    return db.getFilesFromGroup(report.fileGroupId);
  }
}

export async function addSiteReportFile(
  reportId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  const role = await getSiteMemberRole({ reportId }, session);
  if (editReportRoles.includes(role)) {
    let report = await db.getSiteReport(reportId);
    if (report.fileGroupId) {
      const file = await db.addFileToGroup(report.fileGroupId, {
        ...fileInfo,
        uploaderId: session?.user?.id,
      });
      db.addLogMessage({
        message: "Site report file added",
        reportId,
        fileId: file.id,
      });
      return file;
    }
  }
}

export async function deleteSiteReportFile({
  reportId,
  fileId,
}: {
  reportId: number;
  fileId: number;
}) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const file = db.updateFile({ fileId }, { deletedAt: new Date() });
    db.addLogMessage({
      message: "Site report file deleted",
      reportId,
      fileId,
    });
    return file;
  }
}

// ======================== sections ========================

export async function listSiteReportSections(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role))
  //   return db.listSiteReportSections(reportId, true);
  if (viewSiteRoles.includes(role)) return db.listSiteReportSections(reportId);
}

export async function getSiteReportSection(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  // TODO inlcude/exclude unpublished reports
  if (viewSiteRoles.includes(role)) return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title?: string; content?: string },
) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
     db.addSiteReportSection({
      ...args,
      reportId,
    });
    return db.listSiteReportSections(reportId);
  }
}

export async function updateSiteReportSection(
  sectionId: number,
  args: SiteReportSectionNew,
) {
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role)) {
    return db.updateSiteReportSection(sectionId, args);
  }
}

export async function deleteSiteReportSection(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role)) {
    db.deleteSiteReportSection(sectionId);
  }
}

export async function addSiteReportSectionFile(
  sectionId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role)) {
    let section = await db.getSiteReportSection(sectionId);
    if (section.fileGroupId) {
      return db.addFileToGroup(section.fileGroupId, {
        ...fileInfo,
        uploaderId: session?.user?.id,
      });
    }
  }
}

export async function getSiteReportCommentsSectionId(reportId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ reportId }))) {
    return db.ensureSiteReportCommentsSection(reportId);
  }
}

export async function listSiteReportSectionFiles(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role))
    return db.getFilesForReportSection(sectionId, true);
  if (viewSiteRoles.includes(role))
    return db.getFilesForReportSection(sectionId, false);
}

export async function listSiteReportActivities({
  reportId,
}: {
  reportId: number;
}) {
  const role = await getSiteMemberRole({ reportId });
  if (viewSiteRoles.includes(role)) {
    return db.listSiteReportActivities(reportId);
  }
}

export async function getSiteReportActivity({
  activityId,
}: {
  activityId: number;
}) {
  const role = await getSiteMemberRole({ activityId });
  if (viewSiteRoles.includes(role)) {
    return db.getSiteReportActivity(activityId);
  }
}

export async function addSiteActivity({
  reportId,
  activity,
}: {
  reportId: number;
  activity: SiteActivityNew;
}) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const newActivity = await db.addSiteActivity(reportId, activity);
    db.addLogMessage({
      message: "Site activity added",
      reportId,
      activityId: newActivity.id,
    });
    return await db.listSiteReportActivities(reportId);
  }
}

export async function deleteSiteActivity(activityId: number) {
  const role = await getSiteMemberRole({ activityId });
  if (editReportRoles.includes(role)) {
    const removedActivity = await db.deleteSiteActivity(activityId);
    db.addLogMessage({ message: "Site activity removed", activityId });
    return removedActivity;
  }
}

export async function updateSiteActivity({
  activityId,
  values,
}: {
  activityId: number;
  values: SiteActivityNew;
}) {
  const role = await getSiteMemberRole({ activityId });
  if (editReportRoles.includes(role)) {
    const updatedActivity = await db.updateSiteActivity(activityId, values);
    return updatedActivity;
  }
}

export async function listSiteActivityUsedMaterials({
  activityId,
}: {
  activityId: number;
}) {
  const role = await getSiteMemberRole({ activityId });
  if (viewSiteRoles.includes(role)) {
    return db.listSiteActivityUsedMaterials(activityId);
  }
}

export async function updateSiteActivityUsedMaterials({
  activityId,
  materials,
}: {
  activityId: number;
  materials: SiteMaterialNew[];
}) {
  const role = await getSiteMemberRole({ activityId });
  if (editReportRoles.includes(role)) {
    const updatedMaterials = await db.updateSiteActivityUsedMaterials({
      activityId,
      materials,
    });
    return updatedMaterials;
  }
}

export async function listSiteActivityUsedEquipment({
  activityId,
}: {
  activityId: number;
}) {
  const role = await getSiteMemberRole({ activityId });
  if (viewSiteRoles.includes(role)) {
    return db.listSiteActivityUsedEquipment(activityId);
  }
}

export async function updateSiteActivityUsedEquipment(
  activityId: number,
  equipment: SiteEquipmentNew[],
) {
  const role = await getSiteMemberRole({ activityId });
  if (editReportRoles.includes(role)) {
    const updatedEquipment = await db.updateSiteActivityUsedEquipment(
      activityId,
      equipment,
    );
    return updatedEquipment;
  }
}
