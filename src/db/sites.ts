import "server-only";

import { db } from "./_db";
import { and, count, desc, eq, getTableColumns, ne, sql } from "drizzle-orm";
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
import * as Schemas from "@/db/schema";

export async function getAllSites(userId?: number): Promise<SiteAndExtra[]> {
  return await db
    .selectDistinctOn([Schemas.sites1.id], {
      ...getTableColumns(Schemas.sites1),
      myRole: Schemas.siteMembers1.role,
      lastReportDate: Schemas.siteReports1.createdAt,
    })
    .from(Schemas.sites1)
    .leftJoin(
      Schemas.siteReports1,
      eq(Schemas.siteReports1.siteId, Schemas.sites1.id),
    )
    .leftJoin(
      Schemas.siteMembers1,
      and(
        eq(Schemas.siteMembers1.siteId, Schemas.sites1.id),
        userId ? eq(Schemas.siteMembers1.memberId, userId) : undefined,
      ),
    )
    .orderBy(desc(Schemas.sites1.id));
}

// get all the sites that userId is the owner of
export async function getMySites(userId: number): Promise<Site[]> {
  return await db
    .select({
      ...getTableColumns(Schemas.sites1),
    })
    .from(Schemas.sites1)
    .leftJoin(
      Schemas.siteMembers1,
      and(
        eq(Schemas.siteMembers1.siteId, Schemas.sites1.id),
        eq(Schemas.siteMembers1.role, "owner"),
      ),
    )
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteMembers1.memberId),
    )
    .where(eq(Schemas.siteMembers1.memberId, userId))
    .orderBy(desc(Schemas.sites1.id));
}

// get all the sites that userId is a member of
export async function getAllVisibleSites(
  userId: number,
): Promise<SiteAndExtra[]> {
  return await db
    .selectDistinctOn([Schemas.sites1.id], {
      ...getTableColumns(Schemas.sites1),
      myRole: Schemas.siteMembers1.role,
      lastReportDate: Schemas.siteReports1.createdAt,
    })
    .from(Schemas.sites1)
    .leftJoin(
      Schemas.siteReports1,
      eq(Schemas.siteReports1.siteId, Schemas.sites1.id),
    )
    .leftJoin(
      Schemas.siteMembers1,
      eq(Schemas.siteMembers1.siteId, Schemas.sites1.id),
    )
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteMembers1.memberId),
    )
    .where(eq(Schemas.siteMembers1.memberId, userId))
    .orderBy(desc(Schemas.sites1.id));
}

export async function getSiteDetails({
  siteId,
}: {
  siteId: number;
}): Promise<SiteDetails> {
  return await db
    .select({
      ...getTableColumns(Schemas.sites1),
      ...getTableColumns(Schemas.siteDetails1),
    })
    .from(Schemas.sites1)
    .innerJoin(
      Schemas.siteDetails1,
      eq(Schemas.siteDetails1.id, Schemas.sites1.id),
    )
    .where(eq(Schemas.siteDetails1.id, siteId))
    .limit(1)
    .then((r) => r[0]);
}

export async function updateSite(siteId: number, values: SiteNew) {
  return await db
    .update(Schemas.sites1)
    .set(values)
    .where(eq(Schemas.sites1.id, siteId))
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteDetails(
  siteId: number,
  values: SiteDetailsNew,
) {
  return await db
    .update(Schemas.siteDetails1)
    .set(values)
    .where(eq(Schemas.siteDetails1.id, siteId))
    .returning()
    .then((r) => r[0]);
}

// basically because the joins get really confusing,
export async function getSiteMembers(
  siteId: number,
  includeBasicMembers: boolean = true,
): Promise<SiteMember[]> {
  return await db
    .select({
      ...getTableColumns(Schemas.siteMembers1),
      ...getTableColumns(Schemas.users1),
    })
    .from(Schemas.siteMembers1)
    .innerJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.siteMembers1.memberId),
    )
    .where(
      and(
        eq(Schemas.siteMembers1.siteId, siteId),
        includeBasicMembers
          ? undefined
          : ne(Schemas.siteMembers1.role, "member"),
      ),
    )
    .orderBy(
      Schemas.siteMembers1.role,
      Schemas.siteMembers1.dateAdded,
      Schemas.siteMembers1.id,
    );
}

export async function listSiteMeetings(siteId: number): Promise<SiteMeeting[]> {
  return await db
    .select()
    .from(Schemas.siteMeetings1)
    .where(eq(Schemas.siteMeetings1.siteId, siteId))
    .orderBy(Schemas.siteMeetings1.date);
}

export async function getSiteMeeting(meetingId: number): Promise<SiteMeeting> {
  return await db
    .select()
    .from(Schemas.siteMeetings1)
    .where(eq(Schemas.siteMeetings1.id, meetingId))
    .then((r) => r[0]);
}

export async function addSiteMeeting(
  { siteId, userId }: { siteId: number; userId?: number },
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .insert(Schemas.siteMeetings1)
    .values({ ...values, siteId, userId })
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .update(Schemas.siteMeetings1)
    .set(values)
    .where(eq(Schemas.siteMeetings1.id, meetingId))
    .returning()
    .then((r) => r[0]);
}

export async function deleteSiteMeeting(
  meetingId: number,
): Promise<SiteMeeting> {
  return await db
    .delete(Schemas.siteMeetings1)
    .where(eq(Schemas.siteMeetings1.id, meetingId))
    .then((r) => r[0]);
}

export async function getSiteNotices(siteId: number) {
  return await db
    .select()
    .from(Schemas.siteNotices1)
    .where(eq(Schemas.siteNotices1.siteId, siteId));
}

export async function addSiteNotice(siteId: number, description: string) {
  return await db
    .insert(Schemas.siteNotices1)
    .values({ siteId, description })
    .returning()
    .then((n) => n[0]);
}

export async function updateSiteNotice(siteId: number, values: SiteNoticeNew) {
  return await db
    .update(Schemas.siteNotices1)
    .set(values)
    .where(eq(Schemas.siteNotices1.siteId, siteId))
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
      .insert(Schemas.sites1)
      .values({
        title: args.title,
        type: args.type,
        countryCode: args.countryCode,
      })
      .returning()
      .then((r) => r[0]);

    const commentsSection = await tx
      .insert(Schemas.commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const details = await tx
      .insert(Schemas.siteDetails1)
      .values({
        id: site.id,
        address: args.address,
        description: args.description,
        commentsSectionId: commentsSection.id,
      })
      .returning()
      .then((r) => r[0]);

    const member = await tx
      .insert(Schemas.siteMembers1)
      .values({ siteId: site.id, memberId: ownerId, role: "owner" })
      .returning()
      .then((r) => r[0]);

    return site;
  });
}

export async function ensureSiteCommentsSection(siteId: number) {
  return db.transaction(async (tx) => {
    const { commentsSectionId } = await tx
      .select({ commentsSectionId: Schemas.siteDetails1.commentsSectionId })
      .from(Schemas.siteDetails1)
      .where(eq(Schemas.siteDetails1.id, siteId))
      .then((r) => r[0]);

    if (commentsSectionId) return commentsSectionId;

    const commentsSection = await tx
      .insert(Schemas.commentsSections1)
      .values({})
      .returning()
      .then((r) => r[0]);

    const { commentsSectionId: commentsSectionId2 } = await tx
      .update(Schemas.siteDetails1)
      .set({ commentsSectionId: commentsSection.id })
      .where(eq(Schemas.siteDetails1.id, siteId))
      .returning()
      .then((r) => r[0]);

    return commentsSectionId2;
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
    .insert(Schemas.siteMembers1)
    .values({ siteId, memberId: userId, role })
    .returning()
    .then((r) => r[0]);
}

export async function countSiteMembers(siteId: number) {
  return await db
    .select({ count: count() })
    .from(Schemas.siteMembers1)
    .where(eq(Schemas.siteMembers1.siteId, siteId))
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
    .update(Schemas.siteMembers1)
    .set({ role })
    .where(
      and(
        eq(Schemas.siteMembers1.siteId, siteId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
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
    .delete(Schemas.siteMembers1)
    .where(
      and(
        eq(Schemas.siteMembers1.siteId, siteId),
        eq(Schemas.siteMembers1.memberId, userId),
        ne(Schemas.siteMembers1.role, "owner"),
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
    .select({ role: Schemas.siteMembers1.role })
    .from(Schemas.siteMembers1)
    .where(
      and(
        eq(Schemas.siteMembers1.siteId, siteId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}
