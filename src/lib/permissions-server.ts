import * as db from "@/lib/db";
import { Session } from "next-auth";
import { allSiteMemberRoles, SiteMemberRole } from "@/lib/types";

export * from "./permissions";

export async function siteActionAllowed(
  session: Session | null,
  allowedRoles: SiteMemberRole[],
  {
    siteId,
    reportId,
    sectionId,
    meetingId,
  }: {
    siteId?: number;
    reportId?: number;
    sectionId?: number;
    meetingId?: number;
  },
) {
  if (!session?.user) return false;
  if (session.user.role === "admin") return true;

  const userId = session.user.idn;
  let role: SiteMemberRole = null;
  if (siteId) {
    role = await db.getSiteRole({ siteId, userId });
  } else if (reportId) {
    role = await db.getReportRole({ reportId, userId });
  } else if (sectionId) {
    role = await db.getReportSectionRole({ sectionId, userId });
  } else if (meetingId) {
    role = await db.getMeetingRole({ meetingId, userId });
  } else {
    return false;
  }
  return allowedRoles.includes(role);
}
