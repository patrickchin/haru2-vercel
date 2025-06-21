import { allSiteMemberRoles, SiteMemberRole } from "@/lib/types";

export const viewSiteRoles: SiteMemberRole[] = allSiteMemberRoles;
export const editSiteRoles: SiteMemberRole[] = [
  "owner",
  "architect",
  "manager",
  "supervisor",
];

export const editReportRoles: SiteMemberRole[] = [
  "owner",
  "architect",
  "manager",
  "supervisor",
  "contractor",
];

export const allowEditAfterPublish = true;
