import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

import * as Schemas from "@/drizzle/schema";
import { parsePhoneNumber } from "libphonenumber-js";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

export async function getUserAccountByEmail(email: string) {
  return db
    .select({
      ...getTableColumns(Schemas.users1),
      ...getTableColumns(Schemas.accounts1),
    })
    .from(Schemas.accounts1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.accounts1.id))
    .where(eq(Schemas.accounts1.email, email))
    .then((r) => r[0]);
}

export async function getUserAccountByPhone(phone: string) {
  const phoneURI = parsePhoneNumber(phone).getURI();
  return db
    .select({
      ...getTableColumns(Schemas.users1),
      ...getTableColumns(Schemas.accounts1),
    })
    .from(Schemas.accounts1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.accounts1.id))
    .where(eq(Schemas.accounts1.phone, phoneURI))
    .then((r) => r[0]);
}

export async function getUser(userId: number) {
  return await db
    .select()
    .from(Schemas.users1)
    .where(eq(Schemas.users1.id, userId))
    .then((r) => r.at(0));
}

export async function getUserByEmail(email: string) {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
    .where(eq(Schemas.accounts1.email, email))
    .then((r) => r.at(0));
}

export async function getUserByPhone(phone: string) {
  const phoneURI = parsePhoneNumber(phone).getURI();
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
    .where(eq(Schemas.accounts1.phone, phoneURI))
    .then((r) => r.at(0));
}

export async function getAllUsers() {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
      email: Schemas.accounts1.email,
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id));
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
      .insert(Schemas.accounts1)
      .values({
        phone: phoneURI,
        email,
        password: hash,
      })
      .returning()
      .then((r) => r[0]);

    console.log(`createUserIfNotExists id: ${newAccount.id} , name: ${name}`);
    const newUser = await tx
      .insert(Schemas.users1)
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
) {
  return await db.transaction(async (tx) => {
    const oldUser = await tx
      .select()
      .from(Schemas.users1)
      .where(eq(Schemas.users1.id, uploaderId))
      .then((r) => r[0]);
    const updatedUser = await tx
      .update(Schemas.users1)
      .set(values)
      .where(eq(Schemas.users1.id, uploaderId))
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
      .from(Schemas.users1)
      .where(eq(Schemas.users1.id, uploaderId))
      .then((r) => r[0]);

    if (!oldUser) {
      throw new Error(`User with ID ${uploaderId} not found`);
    }

    const updatedUser = await tx
      .update(Schemas.users1)
      .set({ avatarUrl: null })
      .where(eq(Schemas.users1.id, uploaderId))
      .returning()
      .then((r) => r[0]);

    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}
