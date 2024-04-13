import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq, desc } from 'drizzle-orm';
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
}

export async function createUser(name: string, phone: string, email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(Schemas.users1).values({ name, phone, email, password: hash });
}


export async function getUserProjects(userId: number, pagenum: number = 0) {
  const pagesize = 30;
  // TODO maybe don't select things like password and createdat ...
  // TODO make a view
  return await db.select().from(Schemas.projects1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.projects1.userid))
    .where(eq(Schemas.projects1.userid, userId))
    .orderBy(desc(Schemas.projects1.id)) // created at?
    .limit(pagesize).offset(pagesize * pagenum)
}

export async function getUserProject(userId: number, projectId: number) {
  return await db.select().from(Schemas.projects1).where(
    and(
      eq(Schemas.projects1.userid, userId),
      eq(Schemas.projects1.id, projectId),
    )
  ).limit(1);
}

export async function createProject(values: {
  userid: number,
  title: string,
  description: string,
	type: string,
	subtype: string | undefined,
	countrycode: string,
  extrainfo: any
}) {
  return await db.insert(Schemas.projects1).values(values).returning();
}

export async function deleteProject(projectId: number) {
  return await db.delete(Schemas.projects1).where(
    eq(Schemas.projects1.id, projectId)
  ).returning();
}

export async function addFileUrlToProject(values: {
	uploaderid: number,
	projectid: number,
	filename: string,
	url: string,
	type: string,
}) {
  return await db.insert(Schemas.files1).values(values).returning();
}

export async function getFilesUrlsForProject(userId: number, projectId: number) {
  return await db.select().from(Schemas.files1).where(
    and(
      eq(Schemas.files1.projectid, projectId),
      eq(Schemas.files1.uploaderid, userId),
    )
  );
}

export async function deleteAllFilesFromProject(projectId: number) {
  return await db.delete(Schemas.files1).where(
    eq(Schemas.files1.projectid, projectId)
  ).returning();
}