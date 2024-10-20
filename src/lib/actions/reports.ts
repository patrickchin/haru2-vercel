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
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (editReportRoles.includes(role)) {
    return db.listSiteReports(siteId, true);
  }
  if (viewingRoles.includes(await getSiteMemberRole({ siteId }))) {
    return db.listSiteReports(siteId, false);
  }
}

export async function getSiteReport(reportId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ reportId })))
    return db.getSiteReport(reportId);
}

export async function getSiteReportDetails(reportId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ reportId })))
    return db.getSiteReportDetails(reportId);
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
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
    const [details, report] = await Promise.all([
      db.updateSiteReportDetails(reportId, values),
      db.getSiteReport(reportId),
    ]);
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return details;
  }
}

export async function publishReport(reportId: number) {
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
    const report = await db.updateSiteReport(reportId, {
      publishedAt: new Date(),
    });
    revalidatePath(`/sites/${report.siteId}/reports/${report.id}`);
    return report;
  }
}

export async function deleteSiteReport(siteId: number) {
  if (editReportRoles.includes(await getSiteMemberRole({ siteId }))) {
    return await db.deleteSiteReport(siteId);
  }
}

export async function listReportFiles(reportId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ reportId }))) {
    let report = await db.getSiteReport(reportId);
    if (report.fileGroupId) return db.getFilesFromGroup(report.fileGroupId);
  }
}

export async function addSiteReportFile(
  reportId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
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
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
    return db.updateFile(fileId, { deletedAt: new Date() });
  }
}

// ======================== sections ========================

export async function getSiteReportSections(reportId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ reportId })))
    return db.getSiteReportSections(reportId);
}

export async function getSiteReportSection(sectionId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ sectionId })))
    return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title: string; content: string },
) {
  if (editReportRoles.includes(await getSiteMemberRole({ reportId }))) {
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
  if (editReportRoles.includes(await getSiteMemberRole({ sectionId }))) {
    return db.updateSiteReportSection(sectionId, args);
  }
}

export async function addSiteReportSectionFile(
  sectionId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (editReportRoles.includes(await getSiteMemberRole({ sectionId }))) {
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
  if (viewingRoles.includes(await getSiteMemberRole({ sectionId })))
    return db.getFilesForReportSection(sectionId);
}
