import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { desc, eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";

import * as Schemas from "@/drizzle/schema";
import { Site, SiteReport, SiteReportNew } from "@/lib/types/site";

const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

const SiteReportColumns = {
  ...getTableColumns(Schemas.siteReports1),
  reporter: {
    ...getTableColumns(Schemas.users1),
  },
};

export async function getUserSites(userId: number): Promise<Site[]> {
  return await db
    .select({
      ...getTableColumns(Schemas.sites1),
    })
    .from(Schemas.sites1)
    .leftJoin(
      Schemas.siteMembers1,
      eq(Schemas.siteMembers1.siteId, Schemas.sites1.id),
    )
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteMembers1.memberId),
    )
    .where(eq(Schemas.siteMembers1.memberId, userId));
}

export async function addUserSite(userId: number): Promise<Site> {
  const site = await db
    .insert(Schemas.sites1)
    .values({})
    .returning()
    .then((r) => r[0]);

  const member = await db
    .insert(Schemas.siteMembers1)
    .values({ siteId: site.id, memberId: userId })
    .returning()
    .then((r) => r[0]);

  return site;
}

export async function getSiteReports(
  projectId: number,
): Promise<SiteReport[]> {
  return db
    .select(SiteReportColumns)
    .from(Schemas.siteReports1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(eq(Schemas.siteReports1.siteId, projectId))
    .orderBy(desc(Schemas.siteReports1.id));
}

export async function getSiteReport(reportId: number): Promise<SiteReport> {
  return db
    .select(SiteReportColumns)
    .from(Schemas.siteReports1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteReports1.reporterId),
    )
    .where(eq(Schemas.siteReports1.id, reportId))
    .then((r) => r[0]);
}

export async function addSiteReport(
  siteReport: Omit<SiteReportNew, "id" | "createdAt">,
): Promise<SiteReport> {
  return db
    .insert(Schemas.siteReports1)
    .values(siteReport)
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteReport(reportId: number): Promise<SiteReport> {
  return db
    .delete(Schemas.siteReports1)
    .where(eq(Schemas.siteReports1.id, reportId))
    .returning()
    .then((r) => r[0]);
}
