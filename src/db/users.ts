import "server-only";

import { db } from "./_db";
import { eq, getTableColumns } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { parsePhoneNumber } from "libphonenumber-js";
import { HaruUserBasic } from "@/lib/types";
import { users1, accounts1, siteMembers1 } from "./schema";

export async function getUserAccount(userId: number) {
  return db
    .select({
      ...getTableColumns(users1),
      ...getTableColumns(accounts1),
    })
    .from(accounts1)
    .leftJoin(users1, eq(users1.id, accounts1.id))
    .where(eq(accounts1.id, userId))
    .then((r) => r[0]);
}

export async function getUserAccountByEmail(email: string) {
  return db
    .select({
      ...getTableColumns(users1),
      ...getTableColumns(accounts1),
    })
    .from(accounts1)
    .leftJoin(users1, eq(users1.id, accounts1.id))
    .where(eq(accounts1.email, email))
    .then((r) => r[0]);
}

export async function getUserAccountByPhone(phone: string) {
  const phoneURI = parsePhoneNumber(phone).getURI();
  return db
    .select({
      ...getTableColumns(users1),
      ...getTableColumns(accounts1),
    })
    .from(accounts1)
    .leftJoin(users1, eq(users1.id, accounts1.id))
    .where(eq(accounts1.phone, phoneURI))
    .then((r) => r[0]);
}

export async function getUserInternal(userId: number) {
  return await db
    .select()
    .from(users1)
    .where(eq(users1.id, userId))
    .then((r) => r.at(0));
}

export async function getUser(userId: number, requestinUserId: number) {
  const requestUserSites = db
    .selectDistinct({ siteId: siteMembers1.siteId })
    .from(siteMembers1)
    .where(eq(siteMembers1.id, requestinUserId))
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
    .then((r) => r.at(0));
}

export async function getUserByEmail(email: string) {
  return await db
    .select({
      ...getTableColumns(users1),
    })
    .from(users1)
    .leftJoin(accounts1, eq(accounts1.id, users1.id))
    .where(eq(accounts1.email, email))
    .then((r) => r.at(0));
}

export async function getUserByPhone(phone: string) {
  const phoneURI = parsePhoneNumber(phone).getURI();
  return await db
    .select({
      ...getTableColumns(users1),
    })
    .from(users1)
    .leftJoin(accounts1, eq(accounts1.id, users1.id))
    .where(eq(accounts1.phone, phoneURI))
    .then((r) => r.at(0));
}

export async function getAllUsers() {
  return await db
    .select({
      ...getTableColumns(users1),
      email: accounts1.email,
    })
    .from(users1)
    .leftJoin(accounts1, eq(accounts1.id, users1.id));
}

export async function createUserIfNotExists({
  name,
  phone,
  email,
  password,
}: {
  name: string;
  phone?: string;
  email: string;
  password: string;
}) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  const phoneURI = phone ? parsePhoneNumber(phone).getURI() : undefined;

  return db.transaction(async (tx) => {
    console.log(`createUserIfNotExists phone: ${phoneURI} , email: ${email}`);
    const newAccount = await tx
      .insert(accounts1)
      .values({
        phone: phoneURI,
        email,
        password: hash,
      })
      .returning()
      .then((r) => r[0]);

    console.log(`createUserIfNotExists id: ${newAccount.id} , name: ${name}`);
    const newUser = await tx
      .insert(users1)
      .values({
        id: newAccount.id,
        name,
      })
      .returning()
      .then((r) => r[0]);

    console.log("createUserIfNotExists successful");
    return newUser;
  });
}

export async function updateUserAvatar(
  uploaderId: number,
  values: { avatarUrl: string | null },
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

export async function deleteUserAvatar(uploaderId: number) {
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
      .set({ avatarUrl: null })
      .where(eq(users1.id, uploaderId))
      .returning()
      .then((r) => r[0]);

    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}
