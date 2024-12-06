"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/db";
import { auth } from "@/lib/auth";
import { HaruFileNew } from "@/lib/types/common";
import {
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
      supervisorId: session.user.idn,
      supervisorSignDate: new Date(),
    };
  } else if (role === "manager") {
    signArgs = {
      contractorId: session.user.idn,
      contractorSignDate: new Date(),
    };
  } else if (role === "contractor") {
    signArgs = {
      contractorId: session.user.idn,
      contractorSignDate: new Date(),
    };
  } else if (role === "owner") {
    signArgs = {
      ownerId: session.user.idn,
      ownerSignDate: new Date(),
    };
  }

  if (!signArgs) return;
  const report = await db.updateSiteReportDetails(reportId, signArgs);
  if (!report) return;

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
  // if (editReportRoles.includes(role))
  //   return db.getSiteReportSection(reportId, true);
  if (viewSiteRoles.includes(role)) return db.getSiteReportSection(sectionId);
}

export async function addSiteReportSection(
  reportId: number,
  args: { title?: string; content?: string },
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

export async function getSiteReportCommentsSectionId(reportId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ reportId }))) {
    return db.ensureSiteReportCommentsSection(reportId);
  }
}

export async function getSiteReportSectionFiles(sectionId: number) {
  const role = await getSiteMemberRole({ sectionId });
  if (editReportRoles.includes(role))
    return db.getFilesForReportSection(sectionId, true);
  if (viewSiteRoles.includes(role))
    return db.getFilesForReportSection(sectionId, false);
}
