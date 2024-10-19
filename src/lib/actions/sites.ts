"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { addSiteSchema, AddSiteType } from "@/lib/forms";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  editingRoles,
  getSiteMemberRole,
  editMeetingRoles,
  viewingRoles,
} from "@/lib/permissions-server";
import { SiteMeetingNew, SiteMemberRole } from "@/lib/types";

export async function addSite(d: AddSiteType) {
  const session = await auth();
  if (!session?.user) return;

  const parsed = addSiteSchema.safeParse(d);
  if (!parsed.success) return;

  const site = await db.addUserSite(session.user.idn, parsed.data);

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
  if (viewingRoles.includes(await getSiteMemberRole({ siteId })))
    return db.getSiteNotices(siteId);
}

export async function listSiteMeetings(siteId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ siteId })))
    return db.listSiteMeetings(siteId);
}

export async function getSiteMeeting(meetingId: number) {
  if (viewingRoles.includes(await getSiteMemberRole({ meetingId })))
    return db.getSiteMeeting(meetingId);
}

export async function addSiteMeeting(siteId: number, values: SiteMeetingNew) {
  const session = await auth();
  if (editMeetingRoles.includes(await getSiteMemberRole({ siteId })))
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
  if (editingRoles.includes(await getSiteMemberRole({ meetingId })))
    return db.deleteSiteMeeting(meetingId);
}

export async function deleteSiteMeetingReturnAllMeetings(meetingId: number) {
  if (editingRoles.includes(await getSiteMemberRole({ meetingId }))) {
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
  if (editingRoles.includes(await getSiteMemberRole({ siteId }))) {
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
  if (editingRoles.includes(await getSiteMemberRole({ siteId }))) {
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
  if (editingRoles.includes(await getSiteMemberRole({ siteId }))) {
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
  const session = await auth();
  if (!session?.user) return;
  const userId = session.user.idn;
  if (isNaN(userId)) return;

  const role = await db.getSiteRole({ siteId, userId });
  if (!role) return;
  const allowedRoles = [
    "manager",
    "owner",
    "contractor",
    "supervisor",
    // "member", // don't allow normal members to edit that information ?
  ];
  if (!allowedRoles.includes(role)) return;

  try {
    console.log(`User ${userId} updating key site user information ${values}`);
    const ret = await db.updateKeySiteUsers(siteId, values);
    revalidatePath(`/sites/${siteId}`);
    return ret;
  } catch (e: any) {
    console.log(
      `Failed to update key site users (user ${userId}) (site ${siteId}) error: ${e}`,
    );
    return;
  }
}
