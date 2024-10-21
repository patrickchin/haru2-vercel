"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { HaruFileNew } from "@/lib/types/common";
import {
  SiteReportDetailsNew,
  SiteReportNew,
  SiteReportSectionNew,
} from "@/lib/types/site";
import { viewingRoles, editReportRoles } from "@/lib/permissions";
import { getSiteMemberRole } from "@/lib/actions/sites";

export async function listSiteReports(siteId: number) {
  const role = await getSiteMemberRole({ siteId });
  if (editReportRoles.includes(role)) return db.listSiteReports(siteId, true);
  if (viewingRoles.includes(role)) return db.listSiteReports(siteId, false);
}

export async function getSiteReport(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role)) return db.getSiteReport(reportId, true);
  if (viewingRoles.includes(role)) return db.getSiteReport(reportId);
}

export async function getSiteReportDetails(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role))
    return db.getSiteReportDetails(reportId, true);
  if (viewingRoles.includes(role))
    return db.getSiteReportDetails(reportId, false);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (editReportRoles.includes(await getSiteMemberRole({ siteId }, session))) {
    return await db.addSiteReport({
      reporterId: session?.user?.idn ?? null,
      siteId: siteId,
    });
  }
}

export async function updateSiteReport(
  reportId: number,
  values: Omit<SiteReportNew, "publishedAt">,
) {
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
    const report = await db.updateSiteReport(reportId, values);
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return report;
  }
}

export async function updateSiteReportDetails(
  reportId: number,
  values: SiteReportDetailsNew,
) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const [details, report] = await Promise.all([
      db.updateSiteReportDetails(reportId, values),
      db.getSiteReport(reportId),
    ]);
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return details;
  }
}

export async function publishReport(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    const report = await db.updateSiteReport(reportId, {
      publishedAt: new Date(),
    });
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return report;
  }
}

export async function deleteSiteReport(siteId: number) {
  const role = await getSiteMemberRole({ siteId });
  if (editReportRoles.includes(role)) {
    return await db.deleteSiteReport(siteId);
  }
}

export async function listReportFiles(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  let report = null;
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role)) {
  //   report = await db.getSiteReport(reportId, true);
  // }
  if (viewingRoles.includes(role)) {
    report = await db.getSiteReport(reportId);
  }
  if (report?.fileGroupId){
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
      return db.addFileToGroup(report.fileGroupId, {
        ...fileInfo,
        uploaderId: session?.user?.idn,
      });
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
    return db.updateFile(fileId, { deletedAt: new Date() });
  }
}

// ======================== sections ========================

export async function getSiteReportSections(reportId: number) {
  const role = await getSiteMemberRole({ reportId });
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role))
  //   return db.getSiteReportSections(reportId, true);
  if (viewingRoles.includes(role))
    return db.getSiteReportSections(reportId);
}

export async function getSiteReportSection(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  // TODO inlcude/exclude unpublished reports
  // if (editReportRoles.includes(role))
  //   return db.getSiteReportSection(reportId, true);
  if (viewingRoles.includes(role))
    return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title: string; content: string },
) {
  const role = await getSiteMemberRole({ reportId });
  if (editReportRoles.includes(role)) {
    return db.addSiteReportSection({
      ...args,
      reportId,
    });
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
        uploaderId: session?.user?.idn,
      });
    }
  }
}

export async function getSiteReportSectionFiles(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role))
    return db.getFilesForReportSection(sectionId, true);
  if (viewingRoles.includes(role))
    return db.getFilesForReportSection(sectionId, false);
}
