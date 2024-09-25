import * as Schemas from "@/drizzle/schema";
import { HaruUserBasic } from "./common";

export type Site = typeof Schemas.sites1.$inferSelect;
export type SiteNew = Omit<Site, "id">;
export type SiteDetails = Site & typeof Schemas.siteDetails1.$inferSelect;
export type SiteDetailsNew = Omit<SiteDetails, "id">;
export type SiteMemberRole = typeof Schemas.siteMembers1.$inferSelect.role;
export const allSiteMemberRoles = Schemas.siteMemberRole.enumValues;
export type SiteMember = typeof Schemas.siteMembers1.$inferSelect & HaruUserBasic;

export type SiteReport = typeof Schemas.siteReports1.$inferSelect & { reporter?: HaruUserBasic | null; };
export type SiteReportNew = Omit<SiteReport, "id" | "createdAt" | "fileGroupId">;
export type SiteReportDetails = typeof Schemas.siteReportDetails1.$inferSelect;
export type SiteReportDetailsNew = Omit<SiteReportDetails, "id">;
export type SiteReportBoth = SiteReport & SiteReportDetails;
export type SiteReportSection = typeof Schemas.siteReportSections1.$inferSelect;
export type SiteReportSectionNew = Omit<SiteReportSection, "id" | "reportId" | "fileGroupId">;
