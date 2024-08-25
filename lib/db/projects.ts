import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, desc, getTableColumns } from "drizzle-orm";
import postgres from "postgres";

import * as Schemas from "@/drizzle/schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

export async function getUserProjects(userId: number, pagenum: number = 0) {
  const pagesize = 30;
  return await db
    .select({
      ...getTableColumns(Schemas.projects1),
      user: {
        ...getTableColumns(Schemas.users1),
      },
    })
    .from(Schemas.projects1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.projects1.userid))
    .where(eq(Schemas.projects1.userid, userId))
    .orderBy(desc(Schemas.projects1.id)) // created at?
    .limit(pagesize)
    .offset(pagesize * pagenum);
}

export async function getProject(projectId: number) {
  return await db
    .select()
    .from(Schemas.projects1)
    .where(and(eq(Schemas.projects1.id, projectId)))
    .then((r) => r.at(0));
}

export async function createProject(
  values: Omit<typeof Schemas.projects1.$inferInsert, "id">,
) {
  return await db
    .insert(Schemas.projects1)
    .values(values)
    .returning()
    .then((r) => r[0]);
}

export async function deleteProject(projectId: number) {
  return await db
    .delete(Schemas.projects1)
    .where(eq(Schemas.projects1.id, projectId))
    .returning();
}

//update any fields of project
export async function updateProjectFields(
  projectId: number,
  updates: {
    title?: string;
    description?: string;
    type?: string;
    subtype?: string;
    countrycode?: string;
    status?: string;
    extrainfo?: any;
  },
) {
  return await db
    .update(Schemas.projects1)
    .set(updates)
    .where(eq(Schemas.projects1.id, projectId))
    .returning()
    .then((r) => r[0]);
}
