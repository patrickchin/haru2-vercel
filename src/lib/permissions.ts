import { allSiteMemberRoles, SiteMemberRole } from "@/lib/types";

export const viewSiteRoles: SiteMemberRole[] = allSiteMemberRoles;
export const editSiteRoles: SiteMemberRole[] = [
  "supervisor",
  "owner",
  "manager",
];

export const editMeetingRoles: SiteMemberRole[] = ["owner"];
export const acceptMeetingRoles: SiteMemberRole[] = ["supervisor"];

export const editReportRoles: SiteMemberRole[] = [
  "supervisor",
  "owner",
];

export const allowEditAfterPublish = true;
