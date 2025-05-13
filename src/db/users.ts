import "server-only";

import { db } from "./_db";
import { eq, getTableColumns } from "drizzle-orm";
import { HaruUserBasic } from "@/lib/types";
import { accounts1, siteMembers1, users1 } from "./schema";

export async function getUserAccount(userId: string) {
  return db
    .select()
    .from(accounts1)
    .where(eq(accounts1.userId, userId))
    .then((r) => (r.length > 0 ? r[0] : null));
}

export async function getUserInternal(userId?: string) {
  if (!userId) return null;
  return await db
    .select()
    .from(users1)
    .where(eq(users1.id, userId))
    .then((r) => (r.length > 0 ? r[0] : null));
}

export async function getUser(userId: string, requestinUserId: string) {
  if (userId === requestinUserId) {
    return await db
      .select()
      .from(users1)
      .where(eq(users1.id, userId))
      .then((r) => (r.length > 0 ? r[0] : null));
  }

  const requestUserSites = db
    .selectDistinct({ siteId: siteMembers1.siteId })
    .from(siteMembers1)
    .where(eq(siteMembers1.memberId, requestinUserId))
    .as("siteIds");

  const requestUserSiteMembers = db
    .selectDistinct({ memberId: siteMembers1.memberId })
    .from(siteMembers1)
    .fullJoin(
      requestUserSites,
      eq(siteMembers1.siteId, requestUserSites.siteId),
    )
    .where(eq(siteMembers1.siteId, requestUserSites.siteId))
    .as("memberIds");

  return await db
    .select()
    .from(users1)
    .fullJoin(
      requestUserSiteMembers,
      eq(requestUserSiteMembers.memberId, users1.id),
    )
    .where(eq(requestUserSiteMembers.memberId, userId))
    .then((r) => (r.length > 0 ? r[0].user : null));
}

export async function getUserByEmail(email: string) {
  return await db
    .select({
      ...getTableColumns(users1),
    })
    .from(users1)
    .leftJoin(accounts1, eq(accounts1.userId, users1.id))
    .where(eq(users1.email, email))
    .then((r) => (r.length > 0 ? r[0] : null));
}

export async function updateUserAvatar(
  uploaderId: string,
  values: { image: string | null },
): Promise<{ initial: HaruUserBasic; updated: HaruUserBasic }> {
  return await db.transaction(async (tx) => {
    const oldUser = await tx
      .select()
      .from(users1)
      .where(eq(users1.id, uploaderId))
      .then((r) => r[0]);
    const updatedUser = await tx
      .update(users1)
      .set(values)
      .where(eq(users1.id, uploaderId))
      .returning()
      .then((r) => r[0]);
    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}

export async function deleteUserAvatar(uploaderId: string) {
  return await db.transaction(async (tx) => {
    const oldUser = await tx
      .select()
      .from(users1)
      .where(eq(users1.id, uploaderId))
      .then((r) => r[0]);

    if (!oldUser) {
      throw new Error(`User with ID ${uploaderId} not found`);
    }

    const updatedUser = await tx
      .update(users1)
      .set({ image: null })
      .where(eq(users1.id, uploaderId))
      .returning()
      .then((r) => r[0]);

    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}
