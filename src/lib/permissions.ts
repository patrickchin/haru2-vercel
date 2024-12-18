import { allSiteMemberRoles, SiteMemberRole } from "@/lib/types";

type SiteMemberRoleNonNullable = NonNullable<SiteMemberRole>;

export const viewSiteRoles: SiteMemberRoleNonNullable[] = allSiteMemberRoles;
export const editSiteRoles: SiteMemberRoleNonNullable[] = [
  "supervisor",
  "owner",
  "manager",
];

export const editMeetingRoles: SiteMemberRoleNonNullable[] = ["owner"];
export const acceptMeetingRoles: SiteMemberRoleNonNullable[] = ["supervisor"];

export const editReportRoles: SiteMemberRoleNonNullable[] = [
  "supervisor",
  "owner",
];
