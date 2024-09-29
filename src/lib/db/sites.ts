import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, getTableColumns } from "drizzle-orm";
import { Site, SiteDetails, SiteMeeting, SiteMeetingNew, SiteMember } from "@/lib/types/site";
import * as Schemas from "@/drizzle/schema";

const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

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
    .where(eq(Schemas.siteMembers1.memberId, userId));
}

// get all the sites that userId is a member of
export async function getAllVisibleSites(userId: number): Promise<Site[]> {
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

export async function getSiteDetails({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
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
    .innerJoin(
      Schemas.siteMembers1,
      eq(Schemas.siteMembers1.siteId, Schemas.sites1.id),
    )
    .where(
      and(
        eq(Schemas.siteDetails1.id, siteId),
        eq(Schemas.siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => r[0]);
}

// basically because the joins get really confusing,
export async function getSiteMembers(siteId: number): Promise<SiteMember[]> {
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
    .where(eq(Schemas.siteMembers1.siteId, siteId));
}

export async function getSiteMeetings(siteId: number): Promise<SiteMeeting[]> {
  return await db
    .select()
    .from(Schemas.siteMeetings1)
    .where(eq(Schemas.siteMeetings1.siteId, siteId));
}

export async function getSiteMeeting(meetingId: number): Promise<SiteMeeting> {
  return await db
    .select()
    .from(Schemas.siteMeetings1)
    .where(eq(Schemas.siteMeetings1.id, meetingId))
    .then((r) => r[0]);
}

export async function addSiteMeeting(
  siteId: number,
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .insert(Schemas.siteMeetings1)
    .values({ ...values, siteId })
    .returning()
    .then((r) => r[0]);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
): Promise<SiteMeeting> {
  return await db
    .update(Schemas.siteMeetings1)
    .set({ ...values })
    .where(eq(Schemas.siteMeetings1.id, meetingId))
    .returning()
    .then((r) => r[0]);
}

export async function addUserSite(
  ownerId: number,
  args: {
    title: string;
    type: string;
    countryCode: string;
    address?: string;
    postcode?: string;
    description?: string;
  },
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

    const details = await tx
      .insert(Schemas.siteDetails1)
      .values({
        id: site.id,
        address: args.address,
        postcode: args.postcode,
        description: args.description,
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

export async function addUserToSite({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  return await db
    .insert(Schemas.siteMembers1)
    .values({ siteId, memberId: userId })
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

export async function updateKeySiteUsers(
  siteId: number,
  values: {
    managerName?: string;
    managerPhone?: string;
    managerEmail?: string;
    contractorName?: string;
    contractorPhone?: string;
    contractorEmail?: string;
    supervisorName?: string;
    supervisorPhone?: string;
    supervisorEmail?: string;
  },
) {
  return db
    .update(Schemas.siteDetails1)
    .set(values)
    .where(eq(Schemas.siteDetails1.id, siteId));
}
