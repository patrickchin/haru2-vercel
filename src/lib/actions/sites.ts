"use server";

import { revalidatePath } from "next/cache";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { addSiteSchema, AddSiteType } from "@/lib/forms";
import { redirect } from "next/navigation";

export async function addSite(d: AddSiteType) {
  const session = await auth();
  if (!session?.user) return;

  const parsed = addSiteSchema.safeParse(d);
  if (!parsed.success) return;

  const site = await db.addUserSite(session.user.idn, parsed.data);

  redirect(`/site/${site.id}`);
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

export async function getSite(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSite({ siteId, userId: session.user.idn });
}

export async function getSiteMembers(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteMembers(siteId);
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
