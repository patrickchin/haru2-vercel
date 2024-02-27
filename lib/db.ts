'use server';

import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, integer, json } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
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


let projectsTable = pgTable('jobs1', {
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

export async function createProject(userId1: number, info1: any) {
  return await db.insert(projectsTable).values({ userId: userId1, info: info1 }).returning();
}


/*

CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects1(
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users,
  info JSON NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

*/