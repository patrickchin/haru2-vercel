"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { HaruFileNew } from "@/lib/types/common";
import {
  allSiteMemberRoles,
  SiteMemberRole,
  SiteReportDetailsNew,
  SiteReportNew,
} from "@/lib/types/site";
import { Session } from "next-auth";

async function isAllowed(
  session: Session | null,
  allowedRoles: SiteMemberRole[],
  {
    siteId,
    reportId,
    sectionId,
  }: { siteId?: number; reportId?: number; sectionId?: number },
) {
  if (!session?.user) return false;
  const userId = session.user.idn;
  let role: SiteMemberRole = null;
  if (siteId) {
    role = await db.getSiteRole({ siteId, userId });
  } else if (reportId) {
    role = await db.getReportRole({ reportId, userId });
  } else if (sectionId) {
    role = await db.getReportSectionRole({ sectionId, userId });
  } else {
    return false;
  }
  return allowedRoles.includes(role);
}

export async function getSiteReports(siteId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { siteId }))
    return db.getSiteReports(siteId);
}

export async function getSiteReport(reportId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId }))
    return db.getSiteReport(reportId);
}

export async function getSiteReportDetails(reportId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId }))
    return db.getSiteReportDetails(reportId);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { siteId })) {
    return await db.addSiteReport({
      reporterId: session?.user?.idn,
      siteId: siteId,
    });
  }
}

export async function updateSiteReport(
  reportId: number,
  values: SiteReportNew,
) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId })) {
    return await db.updateSiteReport(reportId, values);
  }
}

export async function updateSiteReportDetails(
  reportId: number,
  values: SiteReportDetailsNew,
) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId })) {
    return await db.updateSiteReportDetails(reportId, values);
  }
}

export async function deleteSiteReport(siteId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { siteId })) {
    return await db.deleteSiteReport(siteId);
  }
}

export async function getFilesForReport(reportId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId })) {
    let report = await db.getSiteReport(reportId);
    if (report.fileGroupId) return db.getFilesFromGroup(report.fileGroupId);
  }
}

export async function addSiteReportFile(
  reportId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId })) {
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
  if (await isAllowed(session, allSiteMemberRoles, { reportId }))
    return db.getSiteReportSections(reportId);
}

export async function getSiteReportSection(sectionId: number) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { sectionId }))
    return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title: string; content: string },
) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { reportId })) {
    return db.addSiteReportSection({
      ...args,
      reportId,
    });
  }
}

export async function addSiteReportSectionFile(
  sectionId: number,
  fileInfo: HaruFileNew,
) {
  const session = await auth();
  if (await isAllowed(session, allSiteMemberRoles, { sectionId })) {
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
  if (await isAllowed(session, allSiteMemberRoles, { sectionId }))
    return db.getFilesForReportSection(sectionId);
}
