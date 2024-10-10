import { allSiteMemberRoles, SiteMemberRole } from "@/lib/types";

export const viewingRoles: SiteMemberRole[] = allSiteMemberRoles;
export const editingRoles: SiteMemberRole[] = [
  "supervisor",
  "owner",
  "manager",
];
