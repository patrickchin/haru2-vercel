import * as Schemas from "@/db/schema";
import { HaruUserBasic } from "./common";

export type Site = typeof Schemas.sites1.$inferSelect;
export type SiteDetails = Site & typeof Schemas.siteDetails1.$inferSelect;
export type SiteMemberRole = typeof Schemas.siteMembers1.$inferSelect.role;
export type SiteAndExtra = Site & { myRole?: SiteMemberRole; lastReportDate?: Date | null };
export type SiteMember = typeof Schemas.siteMembers1.$inferSelect & { user: HaruUserBasic };
export type SiteInvitation = typeof Schemas.siteInvitations1.$inferSelect;
export type SiteReport = typeof Schemas.siteReports1.$inferSelect & { reporter?: HaruUserBasic | null; };
export type SiteReportDetails = typeof Schemas.siteReportDetails1.$inferSelect;
export type SiteReportAll = SiteReport & SiteReportDetails;
export type SiteReportSection = typeof Schemas.siteReportSections1.$inferSelect;
export type SiteActivity = typeof Schemas.siteActivity1.$inferSelect;
export type SiteMaterial = typeof Schemas.materials1.$inferSelect;
export type SiteEquipment = typeof Schemas.equipment1.$inferInsert;

export const allSiteMemberRoles = Schemas.siteMemberRole.enumValues;

export type ids2 = "id" | "uuid";

export type SiteNew = Omit<typeof Schemas.sites1.$inferInsert, ids2 | "createdAt">;
export type SiteDetailsNew = Omit<typeof Schemas.siteDetails1.$inferInsert,ids2>;
export type SiteReportNew = Omit<typeof Schemas.siteReports1.$inferInsert, ids2 | "createdAt" | "fileGroupId">;
export type SiteReportDetailsNew = Omit<typeof Schemas.siteReportDetails1.$inferInsert, ids2>;
export type SiteReportSectionNew = Omit<typeof Schemas.siteReportSections1.$inferInsert, ids2 | "reportId" | "fileGroupId">;
export type SiteActivityNew = Omit<typeof Schemas.siteActivity1.$inferInsert, ids2>;
export type SiteMaterialNew = Omit<typeof Schemas.materials1.$inferInsert, ids2>;
export type SiteEquipmentNew = Omit<typeof Schemas.equipment1.$inferInsert, ids2>;