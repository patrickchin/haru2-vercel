import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, integer, json } from 'drizzle-orm/pg-core';
import { and, eq, or } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

import * as Schemas from 'drizzle/schema';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
export const db = drizzle(client);

export async function getUser(email: string) {
  return await db.select().from(Schemas.users1).where(eq(Schemas.users1.email, email));
  return await db.select({
    id: Schemas.users1.id,
    email: Schemas.users1.email,
    password: Schemas.users1.password
  }).from(Schemas.users1).where(eq(Schemas.users1.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(Schemas.users1).values({ email, password: hash });
}


export async function getAllProjects() {
  return await db.select().from(Schemas.projects1);
}

export async function getProject(id: number) {
  return await db.select().from(Schemas.projects1).where(eq(Schemas.projects1.id, id));
}

export async function getProjectsForUser(userId: number) {
  return await db.select().from(Schemas.projects1).where(eq(Schemas.projects1.userid, userId));
}

export async function getUserProject(userId: number, projectId: number) {
  return await db.select().from(Schemas.projects1).where(
    and(
      eq(Schemas.projects1.userid, userId),
      eq(Schemas.projects1.id, projectId),
    )
  ).limit(1);
}

export async function createProject(userId1: number, info1: any) {
  return await db.insert(Schemas.projects1).values({ userid: userId1, info: info1 }).returning();
}

export async function addFileUrlToProject(userId: number, projectId: number, filename: string, fileUrl: string, fileType: string) {
  return await db.insert(Schemas.files1).values({
    uploaderid: userId,
    projectid: projectId,
    filename: filename,
    url: fileUrl,
    type: fileType
  }).returning();
}

export async function getFilesUrlsForProject(projectId: number) {
  return await db.select().from(Schemas.files1).where(eq(Schemas.files1.projectid, projectId));
}

export async function getImageUrlsForProject(projectId: number) {
  return await db.select().from(Schemas.files1).where(
    and(
      eq(Schemas.files1.projectid, projectId),
      or(
        eq(Schemas.files1.type, "image/png"),
        eq(Schemas.files1.type, "image/jpeg"),
        eq(Schemas.files1.type, "image/jpg"),
      )
    )
  );
}