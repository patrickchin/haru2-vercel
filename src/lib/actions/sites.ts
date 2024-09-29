"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { addSiteSchema, AddSiteType } from "@/lib/forms";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  editingRoles,
  siteActionAllowed,
  viewingRoles,
} from "@/lib/permissions";
import { SiteMeetingNew } from "@/lib/types";

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

export async function getSiteMeetings(siteId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { siteId }))
    return db.getSiteMeetings(siteId);
}

export async function getSiteMeeting(meetingId: number) {
  const session = await auth();
  if (await siteActionAllowed(session, viewingRoles, { meetingId }))
    return db.getSiteMeeting(meetingId);
}

export async function addSiteMeeting(siteId: number, values: SiteMeetingNew) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { siteId }))
    return db.addSiteMeeting(siteId, values);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
) {
  const session = await auth();
  if (await siteActionAllowed(session, editingRoles, { meetingId }))
    return db.updateSiteMeeting(meetingId, values);
}

export async function addUserToSite({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(session.user.idn)) return;
  try {
    return db.addUserToSite({
      siteId,
      userId,
    });
  } catch (e: any) {
    console.log(`Failed to add user ${userId} to site ${siteId} error: ${e}`);
    return;
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
