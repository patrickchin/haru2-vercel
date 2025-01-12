import * as Schemas from "@/db/schema";
import { HaruUserBasic } from "./common";

export type Site = typeof Schemas.sites1.$inferSelect;
export type SiteDetails = Site & typeof Schemas.siteDetails1.$inferSelect;
export type SiteMemberRole = typeof Schemas.siteMembers1.$inferSelect.role;
export type SiteAndExtra = Site & { myRole?: SiteMemberRole; lastReportDate?: Date | null };
export type SiteMember = typeof Schemas.siteMembers1.$inferSelect & HaruUserBasic;
export type SiteInvitation = typeof Schemas.siteInvitations1.$inferSelect;
export type SiteMeeting = typeof Schemas.siteMeetings1.$inferSelect;
export type SiteNotice = typeof Schemas.siteNotices1.$inferSelect;
export type SiteReport = typeof Schemas.siteReports1.$inferSelect & { reporter?: HaruUserBasic | null; };
export type SiteReportDetails = typeof Schemas.siteReportDetails1.$inferSelect;
export type SiteReportAll = SiteReport & SiteReportDetails;
export type SiteReportSection = typeof Schemas.siteReportSections1.$inferSelect;
export type SiteMaterial = typeof Schemas.materials1.$inferSelect;

export const allSiteMemberRoles = Schemas.siteMemberRole.enumValues;

export type SiteNew = Omit<typeof Schemas.sites1.$inferInsert, "id" | "createdAt">;
export type SiteDetailsNew = Omit<typeof Schemas.siteDetails1.$inferInsert, "id">;
export type SiteMeetingNew = Omit<typeof Schemas.siteMeetings1.$inferInsert, "id" | "siteId" | "userId">;
export type SiteNoticeNew = Omit<typeof Schemas.siteNotices1.$inferInsert, "id" | "siteId" | "createdAt">;
export type SiteReportNew = Omit<typeof Schemas.siteReports1.$inferInsert, "id" | "createdAt" | "fileGroupId">;
export type SiteReportDetailsNew = Omit<typeof Schemas.siteReportDetails1.$inferInsert, "id">;
export type SiteReportSectionNew = Omit<typeof Schemas.siteReportSections1.$inferInsert, "id" | "reportId" | "fileGroupId">;
export type SiteMaterialNew = Omit<typeof Schemas.materials1.$inferInsert, "id"| "materialsListId">;