import "server-only";

import { db } from "./_db";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  isNotNull,
  isNull,
  ne,
} from "drizzle-orm";
import {
  Site,
  SiteAndExtra,
  SiteDetails,
  SiteDetailsNew,
  SiteMeeting,
  SiteMeetingNew,
  SiteMember,
  SiteMemberRole,
  SiteNew,
  SiteNoticeNew,
} from "@/lib/types/site";
import {
  sites1,
  siteMembers1,
  siteReports1,
  users1,
  siteDetails1,
  siteMeetings1,
  siteNotices1,
  commentsSections1,
  siteInvitations1,
  accounts1,
  fileGroups1,
  materials1,
  materialsList1,
  siteActivity1,
  siteActivityList1,
  siteReportDetails1,
} from "./schema";

export async function getAllSites(userId?: number): Promise<SiteAndExtra[]> {
  return await db
    .selectDistinctOn([sites1.id], {
      ...getTableColumns(sites1),
      myRole: siteMembers1.role,
      lastReportDate: siteReports1.createdAt,
    })
    .from(sites1)
    .leftJoin(
      siteReports1,
      and(eq(siteReports1.siteId, sites1.id), isNull(siteReports1.deletedAt)),
    )
    .leftJoin(
      siteMembers1,
      and(
        eq(siteMembers1.siteId, sites1.id),
        userId ? eq(siteMembers1.memberId, userId) : undefined,
      ),
    )
    .orderBy(desc(sites1.id));
}

// get all the sites that userId is the owner of
export async function getMySites(userId: number): Promise<Site[]> {
  return await db
    .select({
      ...getTableColumns(sites1),
    })
    .from(sites1)
    .leftJoin(
      siteMembers1,
      and(eq(siteMembers1.siteId, sites1.id), eq(siteMembers1.role, "owner")),
    )
    .leftJoin(users1, eq(users1.id, siteMembers1.memberId))
    .where(eq(siteMembers1.memberId, userId))
    .orderBy(desc(sites1.id));
}

// get all the sites that userId is a member of
export async function getAllVisibleSites(
  userId: number,
): Promise<SiteAndExtra[]> {
  return await db
    .selectDistinctOn([sites1.id], {
      ...getTableColumns(sites1),
      myRole: siteMembers1.role,
      lastReportDate: siteReports1.createdAt,
    })
    .from(sites1)
    .leftJoin(
      siteReports1,
      and(
        isNull(siteReports1.deletedAt),
        isNotNull(siteReports1.publishedAt),
        eq(siteReports1.siteId, sites1.id),
      ),
    )
    .leftJoin(siteMembers1, eq(siteMembers1.siteId, sites1.id))
    .leftJoin(users1, eq(users1.id, siteMembers1.memberId))
    .where(eq(siteMembers1.memberId, userId))
    .orderBy(desc(sites1.id));
}

export async function getSiteDetails({
  siteId,
}: {
  siteId: number;
}): Promise<SiteDetails> {
  return await db
    .select({
      ...getTableColumns(sites1),
      ...getTableColumns(siteDetails1),
    })
    .from(sites1)
    .innerJoin(siteDetails1, eq(siteDetails1.id, sites1.id))
    .where(eq(siteDetails1.id, siteId))
    .limit(1)
    .then((r) => r[0]);
}

export async function updateSite(siteId: number, values: SiteNew) {
  return await db
    .update(sites1)
    .set(values)
    .where(eq(sites1.id, siteId))
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteDetails(
  siteId: number,
  values: SiteDetailsNew,
) {
  return await db
    .update(siteDetails1)
    .set(values)
    .where(eq(siteDetails1.id, siteId))
    .returning()
    .then((r) => r[0]);
}

// basically because the joins get really confusing,
export async function listSiteMembers(
  siteId: number,
  includeBasicMembers: boolean = true,
): Promise<SiteMember[]> {
  return await db
    .select({
      ...getTableColumns(siteMembers1),
      ...getTableColumns(users1),
    })
    .from(siteMembers1)
    .innerJoin(users1, eq(users1.id, siteMembers1.memberId))
    .where(
      and(
        eq(siteMembers1.siteId, siteId),
        includeBasicMembers ? undefined : ne(siteMembers1.role, "member"),
      ),
    )
    .orderBy(siteMembers1.role, siteMembers1.dateAdded, siteMembers1.id);
}

export async function listSiteMeetings(siteId: number): Promise<SiteMeeting[]> {
  return await db
    .select()
    .from(siteMeetings1)
    .where(eq(siteMeetings1.siteId, siteId))
    .orderBy(siteMeetings1.date);
}

export async function getSiteMeeting(meetingId: number): Promise<SiteMeeting> {
  return await db
    .select()
    .from(siteMeetings1)
    .where(eq(siteMeetings1.id, meetingId))
    .then((r) => r[0]);
}

export async function addSiteMeeting(
  { siteId, userId }: { siteId: number; userId?: number },
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .insert(siteMeetings1)
    .values({ ...values, siteId, userId })
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .update(siteMeetings1)
    .set(values)
    .where(eq(siteMeetings1.id, meetingId))
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteMeeting(
  meetingId: number,
): Promise<SiteMeeting> {
  return await db
    .delete(siteMeetings1)
    .where(eq(siteMeetings1.id, meetingId))
    .returning()
    .then((r) => r[0]);
}

export async function getSiteNotices(siteId: number) {
  return await db
    .select()
    .from(siteNotices1)
    .where(eq(siteNotices1.siteId, siteId));
}

export async function addSiteNotice(siteId: number, description: string) {
  return await db
    .insert(siteNotices1)
    .values({ siteId, description })
    .returning()
    .then((n) => n[0]);
}

export async function updateSiteNotice(siteId: number, values: SiteNoticeNew) {
  return await db
    .update(siteNotices1)
    .set(values)
    .where(eq(siteNotices1.siteId, siteId))
    .returning()
    .then((n) => n[0]);
}

export async function addSite(
  ownerId: number,
  args: Pick<
    SiteNew & SiteDetailsNew,
    "title" | "type" | "countryCode" | "address" | "description"
  >,
): Promise<Site> {
  return db.transaction(async (tx) => {
    const site = await tx
      .insert(sites1)
      .values({
        title: args.title,
        type: args.type,
        countryCode: args.countryCode,
      })
      .returning()
      .then((r) => r[0]);

    const commentsSection = await tx
      .insert(commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const details = await tx
      .insert(siteDetails1)
      .values({
        id: site.id,
        address: args.address,
        description: args.description,
        commentsSectionId: commentsSection.id,
      })
      .returning()
      .then((r) => r[0]);

    const member = await tx
      .insert(siteMembers1)
      .values({ siteId: site.id, memberId: ownerId, role: "owner" })
      .returning()
      .then((r) => r[0]);

    return site;
  });
}

export async function ensureSiteCommentsSection(siteId: number) {
  return db.transaction(async (tx) => {
    const { commentsSectionId } = await tx
      .select({ commentsSectionId: siteDetails1.commentsSectionId })
      .from(siteDetails1)
      .where(eq(siteDetails1.id, siteId))
      .then((r) => r[0]);

    if (commentsSectionId) return commentsSectionId;

    const commentsSection = await tx
      .insert(commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const { commentsSectionId: commentsSectionId2 } = await tx
      .update(siteDetails1)
      .set({ commentsSectionId: commentsSection.id })
      .where(eq(siteDetails1.id, siteId))
      .returning()
      .then((r) => r[0]);

    return commentsSectionId2;
  });
}

export async function ensureSiteFilesSection(siteId: number) {
  return db.transaction(async (tx) => {
    const { fileGroupId } = await tx
      .select({ fileGroupId: siteDetails1.fileGroupId })
      .from(siteDetails1)
      .where(eq(siteDetails1.id, siteId))
      .then((r) => r[0]);

    if (fileGroupId) return fileGroupId;

    const fileGroup = await tx
      .insert(fileGroups1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const { fileGroupId: fileGroupId2 } = await tx
      .update(siteDetails1)
      .set({ fileGroupId: fileGroup.id })
      .where(eq(siteDetails1.id, siteId))
      .returning()
      .then((r) => r[0]);

    return fileGroupId2;
  });
}

export async function addSiteMember({
  siteId,
  userId,
  role,
}: {
  siteId: number;
  userId: number;
  role: SiteMemberRole;
}) {
  return await db
    .insert(siteMembers1)
    .values({ siteId, memberId: userId, role })
    .returning()
    .then((r) => r[0]);
}

export async function countSiteMembers(siteId: number) {
  return await db
    .select({ count: count() })
    .from(siteMembers1)
    .where(eq(siteMembers1.siteId, siteId))
    .then((r) => r[0].count);
}

export async function updateSiteMemberRole({
  siteId,
  userId,
  role,
}: {
  siteId: number;
  userId: number;
  role: SiteMemberRole;
}) {
  return await db
    .update(siteMembers1)
    .set({ role })
    .where(
      and(eq(siteMembers1.siteId, siteId), eq(siteMembers1.memberId, userId)),
    )
    .returning()
    .then((r) => r[0]);
}

export async function removeSiteMember({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  return await db
    .delete(siteMembers1)
    .where(
      and(
        eq(siteMembers1.siteId, siteId),
        eq(siteMembers1.memberId, userId),
        ne(siteMembers1.role, "owner"),
      ),
    )
    .returning()
    .then((r) => r[0]);
}

export async function getSiteRole({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .where(
      and(eq(siteMembers1.siteId, siteId), eq(siteMembers1.memberId, userId)),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function addSiteInvitation(
  siteId: number,
  values: { email?: string },
) {
  return db
    .insert(siteInvitations1)
    .values({
      siteId,
      ...values,
    })
    .onConflictDoNothing()
    .returning()
    .then((i) => i[0]);
}

export async function countSiteInvitations(siteId: number) {
  return db
    .select({ count: count() })
    .from(siteInvitations1)
    .where(eq(siteInvitations1.siteId, siteId))
    .then((r) => r[0].count);
}

export async function listSiteInvitations(siteId: number) {
  return db
    .select()
    .from(siteInvitations1)
    .where(eq(siteInvitations1.siteId, siteId));
}

export async function deleteSiteInvitation(invitationId: number) {
  return db
    .delete(siteInvitations1)
    .where(eq(siteInvitations1.id, invitationId))
    .returning()
    .then((i) => i[0]);
}

export async function acceptSiteInvitation({
  invitationId,
  userId,
}: {
  invitationId: number;
  userId: number;
}) {
  return db.transaction(async (tx) => {
    const inv = await deleteSiteInvitation(invitationId);
    if (inv.siteId)
      return addSiteMember({ siteId: inv.siteId, userId, role: "member" });
  });
}

export async function acceptAllUserInvitations({ userId }: { userId: number }) {
  return db.transaction(async (tx) => {
    const account = await tx
      .select()
      .from(accounts1)
      .where(eq(accounts1.id, userId))
      .then((r) => r[0]);
    if (!account.email) return;

    const invitations = await tx
      .delete(siteInvitations1)
      .where(eq(siteInvitations1.email, account.email))
      .returning();

    console.log(
      `User ${userId} (${account.email}) accepting ${invitations.length} invitations.`,
    );

    const memberships = invitations.map((inv) => ({
      siteId: inv.siteId,
      memberId: userId,
      role: "member" as SiteMemberRole,
    }));
    if (memberships.length < 1) return;

    return await db.insert(siteMembers1).values(memberships).returning();
  });
}

export async function listSiteActivityMaterials({
  siteId,
}: {
  siteId: number;
}) {
  return db
    .select({
      ...getTableColumns(materials1),
      reportId: siteReportDetails1.id,
      reportCreatedDate: siteReports1.createdAt,
      activityName: siteActivity1.name,
      activityEndDate: siteActivity1.endOfDate,
    })
    .from(materials1)
    .innerJoin(
      materialsList1,
      eq(materialsList1.id, materials1.materialsListId),
    )
    .innerJoin(
      siteActivity1,
      eq(siteActivity1.usedMaterialsListId, materialsList1.id),
    )
    .innerJoin(
      siteActivityList1,
      eq(siteActivityList1.id, siteActivity1.siteActivityListId),
    )
    .innerJoin(
      siteReportDetails1,
      eq(siteReportDetails1.siteActivityListId, siteActivityList1.id),
    )
    .innerJoin(siteReports1, eq(siteReports1.id, siteReportDetails1.id))
    .where(
      and(
        eq(siteReports1.siteId, siteId),
        isNotNull(siteReports1.publishedAt),
        isNull(siteReports1.deletedAt),
      ),
    );
}
