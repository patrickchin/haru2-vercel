import * as db from "@/lib/db";
import { Session } from "next-auth";
import { SiteMemberRole } from "@/lib/types";
import { auth } from "@/lib/auth";

export * from "./permissions";

export async function getSiteMemberRole(
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
  session?: Session | null,
): Promise<SiteMemberRole> {

  const s = session === undefined ? await auth() : session;
  if (!s?.user) return null;
  if (s.user.role === "admin") return "supervisor";

  const userId = s.user.idn;
  let role: SiteMemberRole = null;
  if (siteId) {
    role = await db.getSiteRole({ siteId, userId });
  } else if (reportId) {
    role = await db.getReportRole({ reportId, userId });
  } else if (sectionId) {
    role = await db.getReportSectionRole({ sectionId, userId });
  } else if (meetingId) {
    role = await db.getMeetingRole({ meetingId, userId });
  }
  return role;
}
