import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, integer, json } from 'drizzle-orm/pg-core';
import { and, eq, or } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

let usersTable = pgTable('users1', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
});

export async function getUser(email: string) {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
  return await db.select({
    id: usersTable.id,
    email: usersTable.email,
    password: usersTable.password
  }).from(usersTable).where(eq(usersTable.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(usersTable).values({ email, password: hash });
}


let projectsTable = pgTable('projects1', {
  id: serial('id').primaryKey(),
  userId: integer('userid').references(() => usersTable.id),
  info: json('info'),
});

export async function getAllProjects() {
  return await db.select().from(projectsTable);
}

export async function getProject(id: number) {
  return await db.select().from(projectsTable).where(eq(projectsTable.id, id));
}

export async function getProjectsForUser(userId: number) {
  return await db.select().from(projectsTable).where(eq(projectsTable.userId, userId));
}

export async function getUserProject(userId: number, projectId: number) {
  return await db.select().from(projectsTable).where(
    and(
      eq(projectsTable.userId, userId),
      eq(projectsTable.id, projectId),
    )
  ).limit(1);
}

export async function createProject(userId1: number, info1: any) {
  return await db.insert(projectsTable).values({ userId: userId1, info: info1 }).returning();
}

let filesTable = pgTable('files1', {
  id: serial('id').primaryKey(),
  uploaderId: integer('uploaderid').references(() => usersTable.id),
  projectId: integer('projectid').references(() => projectsTable.id),
  url: varchar('url', { length: 255 }),
  type: varchar('type', { length: 255 }),
});

export async function addFileUrlToProject(userId: number, projectId: number, fileUrl: string, fileType: string) {
  return await db.insert(filesTable).values({ uploaderId: userId, projectId: projectId, url: fileUrl, type: fileType }).returning();
}

export async function getFilesUrlsForProject(projectId: number) {
  return await db.select().from(filesTable).where(eq(filesTable.projectId, projectId));
}

export async function getImageUrlsForProject(projectId: number) {
  return await db.select().from(filesTable).where(
    and(
      eq(filesTable.projectId, projectId),
      or(
        eq(filesTable.type, "image/png"),
        eq(filesTable.type, "image/jpeg"),
        eq(filesTable.type, "image/jpg"),
      )
    )
  );
}

/*

CREATE TABLE IF NOT EXISTS users1(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects1(
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users1,
  info JSON NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files1(
    id serial primary key,
    uploaderId INTEGER REFERENCES users1,
    projectId INTEGER REFERENCES projects1,
    url VARCHAR(255),
    type VARCHAR(255)
);

*/