"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

export async function addUserSite() {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(session.user.idn)) return;
  return db.addUserSite(session.user.idn);
}

export async function getUserSites() {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(session.user.idn)) return;
  const projects = await db.getUserSites(session.user.idn);
  if (projects.length > 0) return projects;
  db.addUserSite(session.user.idn);
  return db.getUserSites(session.user.idn);
}

export async function getSiteReports(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteReports(siteId);
}

export async function addSiteReportForm(siteId: number, data: FormData) {
  addSiteReport(siteId);
}

export async function addSiteReport(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  await db.addSiteReport({
    reporterId: session.user.idn,
    siteId: siteId,
  });
  revalidatePath("/site/[[...slug]]", "page");
  // revalidateTag();
}

export async function getFilesForReport(reportId: number) {
  const session = await auth();
  if (!session?.user) return;
  if (isNaN(reportId)) return;
  return db.getFilesForReport(reportId);
}
