"use server";

import * as db from "@/db";
import { auth } from "@/lib/auth";
import { zSiteNewBoth, zSiteNewBothType } from "@/lib/forms";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  editSiteRoles,
  editMeetingRoles,
  viewSiteRoles,
} from "@/lib/permissions";
import { SiteMeetingNew, SiteMemberRole } from "@/lib/types";
import { Session } from "next-auth";

export async function addSite(data: zSiteNewBothType) {
  const session = await auth();
  if (!session?.user) return;
  const parsed = zSiteNewBoth.safeParse(data);
  if (!parsed.success) return;
  const site = await db.addSite(session.user.idn, parsed.data);
  redirect(`/sites/${site.id}`);
}

export async function getMySites() {
  const session = await auth();
  if (!session?.user) return;
  return db.getMySites(session.user.idn);
}

export async function getAllVisibleSites() {
  const session = await auth();
  if (!session?.user) return;
  return db.getAllVisibleSites(session.user.idn);
}

export async function getSiteDetails(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteDetails({ siteId, userId: session.user.idn });
}

export async function getSiteMembers(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteMembers(siteId);
}

export async function getSiteRole(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteRole({ siteId, userId: session.user.idn });
}

export async function getSiteNotices(siteId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ siteId })))
    return db.getSiteNotices(siteId);
}

export async function listSiteMeetings(siteId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ siteId })))
    return db.listSiteMeetings(siteId);
}

export async function getSiteMeeting(meetingId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ meetingId })))
    return db.getSiteMeeting(meetingId);
}

export async function addSiteMeeting(siteId: number, values: SiteMeetingNew) {
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (editMeetingRoles.includes(role))
    return db.addSiteMeeting({ siteId, userId: session?.user?.idn }, values);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
) {
  // TODO only _we_ should be able to confirm a meeting with ourselves lol
  if (editMeetingRoles.includes(await getSiteMemberRole({ meetingId }))) {
    return db.updateSiteMeeting(meetingId, values);
  }
}

export async function updateSiteMeetingReturnAllMeetings(
  meetingId: number,
  values: SiteMeetingNew,
) {
  if (editMeetingRoles.includes(await getSiteMemberRole({ meetingId }))) {
    const meeting = await db.updateSiteMeeting(meetingId, values);
    return meeting.siteId ? db.listSiteMeetings(meeting.siteId) : [meeting];
  }
}

export async function deleteSiteMeeting(meetingId: number) {
  if (editSiteRoles.includes(await getSiteMemberRole({ meetingId })))
    return db.deleteSiteMeeting(meetingId);
}

export async function deleteSiteMeetingReturnAllMeetings(meetingId: number) {
  if (editSiteRoles.includes(await getSiteMemberRole({ meetingId }))) {
    const meeting = await db.deleteSiteMeeting(meetingId);
    return meeting.siteId ? db.listSiteMeetings(meeting.siteId) : [meeting];
  }
}
export async function addSiteMemberByEmail({
  siteId,
  email,
}: {
  siteId: number;
  email: string;
}) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    const user = await db.getUserByEmail(email);
    if (!user) return;
    return db.addSiteMember({ siteId, userId: user.id, role: "member" });
  }
}

export async function updateSiteMemberRole({
  siteId,
  userId,
  role,
}: {
  siteId: number;
  userId: number;
  role: SiteMemberRole;
}) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    return db.updateSiteMemberRole({ siteId, userId, role });
  }
}

export async function removeSiteMember({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    const n = await db.countSiteMembers(siteId);
    if (n > 1) return db.removeSiteMember({ siteId, userId });
  }
}

export async function updateKeySiteUsers(
  siteId: number,
  values: {
    managerName?: string;
    managerPhone?: string;
    managerEmail?: string;
    contractorName?: string;
    contractorPhone?: string;
    contractorEmail?: string;
    supervisorName?: string;
    supervisorPhone?: string;
    supervisorEmail?: string;
  },
) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    const ret = await db.updateKeySiteUsers(siteId, values);
    revalidatePath(`/sites/${siteId}`);
    return ret;
  }
}

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
