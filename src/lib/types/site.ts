import * as Schemas from "@/drizzle/schema";
import { HaruUserBasic } from "./common";

export type Site = typeof Schemas.sites1.$inferSelect;
export type SiteNew = Omit<typeof Schemas.sites1.$inferInsert, "id">;
export type SiteDetails = Site & typeof Schemas.siteDetails1.$inferSelect;
export type SiteDetailsNew = Omit<
  typeof Schemas.siteDetails1.$inferInsert,
  "id"
>;
export type SiteMemberRole = typeof Schemas.siteMembers1.$inferSelect.role;
export const siteMemberRoles = Schemas.siteMemberRole.enumValues;
export type SiteMember = typeof Schemas.siteMembers1.$inferSelect &
  HaruUserBasic;

export type SiteReport = typeof Schemas.siteReports1.$inferSelect & {
  reporter?: HaruUserBasic | null;
};
export type SiteReportDetails = SiteReport &
  typeof Schemas.siteReportDetails1.$inferSelect;
export type SiteReportNew = Omit<
  typeof Schemas.siteReports1.$inferInsert,
  "id" | "createdAt"
>;
export const nullSiteReportDetails: SiteReportDetails = {
  id: 0,
  siteId: null,
  reporterId: null,
  reporter: null,
  createdAt: null,
  visitDate: null,

  activity: null,
  contractors: null,
  engineers: null,
  workers: null,
  visitors: null,
  materials: null,
  equiptment: null,
};
