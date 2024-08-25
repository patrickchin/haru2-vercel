"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addUserSite() {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(session.user.idn)) return;
  const sites = db.addUserSite(session.user.idn);
  revalidatePath("/sites");
  return sites;
}

export async function getUserSites() {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(session.user.idn)) return;
  return db.getUserSites(session.user.idn);
}

export async function getSiteReports(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteReports(siteId);
}

export async function getSiteReport(reportId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteReport(reportId);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return await db.addSiteReport({
    reporterId: session.user.idn,
    siteId: siteId,
  });
  // revalidatePath("/site/[[...slug]]", "page");
}

export async function deleteSiteReport(reportId: number) {
  const session = await auth();
  if (!session?.user) return;
  return await db.deleteSiteReport(reportId);
  // revalidatePath("/site/[[...slug]]", "page");
}

export async function getFilesForReport(reportId: number) {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(reportId)) return;
  return db.getFilesForReport(reportId);
}
