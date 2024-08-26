import * as Schemas from "@/drizzle/schema";
import * as db from "@/lib/db";
import { HaruUserBasic } from "./common";

export type Site = typeof Schemas.sites1.$inferSelect;
export type SiteNew = Omit<typeof Schemas.sites1.$inferInsert, "id">;
export type SiteDetails = Site & typeof Schemas.siteDetails1.$inferSelect;
export type SiteDetailsNew = Omit<
  typeof Schemas.siteDetails1.$inferInsert,
  "id"
>;
export type SiteMember = typeof Schemas.siteMembers1.$inferSelect &
  HaruUserBasic;

export type SiteReport = typeof Schemas.siteReports1.$inferSelect & {
  reporter?: HaruUserBasic | null;
};
export type SiteReportNew = Omit<
  typeof Schemas.siteReports1.$inferInsert,
  "id" | "createdAt"
>;
export const nullSiteReport: SiteReport = {
  id: 0,
  reporterId: null,
  reporter: null,
  siteId: null,
  createdAt: null,
};
