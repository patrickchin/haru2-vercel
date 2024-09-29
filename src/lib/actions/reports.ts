"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { HaruFileNew } from "@/lib/types/common";
import {
  allSiteMemberRoles,
  SiteMemberRole,
  SiteReportDetailsNew,
  SiteReportNew,
  SiteReportSectionNew,
} from "@/lib/types/site";
import {
  editingRoles,
  siteActionAllowed,
  viewingRoles,
} from "@/lib/permissions";

export async function getSiteReports(siteId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { siteId }))
    return db.getSiteReports(siteId);
}

export async function getSiteReport(reportId: number) {
  const session = await auth();
  if (isNaN(reportId)) return;
  if (await siteActionAllowed(session, viewingRoles, { reportId }))
    return db.getSiteReport(reportId);
}

export async function getSiteReportDetails(reportId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { reportId }))
    return db.getSiteReportDetails(reportId);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { siteId })) {
    return await db.addSiteReport({
      reporterId: session?.user?.idn ?? null,
      siteId: siteId,
    });
  }
}

export async function updateSiteReport(
  reportId: number,
  values: SiteReportNew,
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { reportId })) {
    return await db.updateSiteReport(reportId, values);
  }
}

export async function updateSiteReportDetails(
  reportId: number,
  values: SiteReportDetailsNew,
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { reportId })) {
    return await db.updateSiteReportDetails(reportId, values);
  }
}

export async function deleteSiteReport(siteId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, [], { siteId })) {
    return await db.deleteSiteReport(siteId);
  }
}

export async function getFilesForReport(reportId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, allSiteMemberRoles, { reportId })) {
    let report = await db.getSiteReport(reportId);
    if (report.fileGroupId) return db.getFilesFromGroup(report.fileGroupId);
  }
}

export async function addSiteReportFile(
  reportId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { reportId })) {
    let report = await db.getSiteReport(reportId);
    if (report.fileGroupId) {
      return db.addFileToGroup(report.fileGroupId, {
        ...fileInfo,
        uploaderId: session?.user?.idn,
      });
    }
  }
}

// ======================== sections ========================

export async function getSiteReportSections(reportId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { reportId }))
    return db.getSiteReportSections(reportId);
}

export async function getSiteReportSection(sectionId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { sectionId }))
    return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title: string; content: string },
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { reportId })) {
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
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { sectionId })) {
    return db.updateSiteReportSection(sectionId, args);
  }
}

export async function addSiteReportSectionFile(
  sectionId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { sectionId })) {
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
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { sectionId }))
    return db.getFilesForReportSection(sectionId);
}
