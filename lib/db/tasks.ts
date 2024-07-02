import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import {
  and,
  eq,
  or,
  desc,
  asc,
  isNotNull,
  getTableColumns,
} from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

import * as Schemas from "@/drizzle/schema";
import assert from "assert";
import { defaultTeams } from "@/lib/types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

export async function createTaskSpecs(
  values: (typeof Schemas.taskspecs1.$inferInsert)[],
) {
  return await db
    .insert(Schemas.taskspecs1)
    .values(values)
    .onConflictDoNothing()
    .returning();
}

export async function getTaskSpecsOfType(type: string) {
  return await db
    .select()
    .from(Schemas.taskspecs1)
    .where(eq(Schemas.taskspecs1.type, type));
}

export async function getTaskSpecs() {
  return await db.select().from(Schemas.taskspecs1);
}

export async function getTaskSpec(specid: number) {
  return await db
    .select()
    .from(Schemas.taskspecs1)
    .where(eq(Schemas.taskspecs1.id, specid))
    .limit(1);
}

export async function createProjectTasks(
  values: (typeof Schemas.tasks1.$inferInsert)[],
) {
  return await db.insert(Schemas.tasks1).values(values).returning();
}

export async function createProjectTasksFromAllSpecs(projectId: number) {
  return db.transaction(async (tx) => {
    const existingTasks = await tx
      .select()
      .from(Schemas.tasks1)
      .where(eq(Schemas.tasks1.projectid, projectId))
      .limit(1);
    if (existingTasks.length > 0) return; // or throw error?

    const specs = await tx.select().from(Schemas.taskspecs1);
    const tasks = specs.map((spec) => {
      return {
        specid: spec.id,
        projectid: projectId,
        type: spec.type,
        title: spec.title,
        description: spec.description,
        enabled: true,
      };
    });
    return await tx.insert(Schemas.tasks1).values(tasks).returning();
  });
}

export async function enableProjectTaskSpec(
  projectId: number,
  specId: number,
  enabled: boolean,
) {
  return await db
    .update(Schemas.tasks1)
    .set({ enabled })
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectId),
        eq(Schemas.tasks1.specid, specId),
      ),
    )
    .returning()
    .then((r) => r[0]);
}

export async function enableProjectTask(taskId: number, enabled: boolean) {
  return await db
    .update(Schemas.tasks1)
    .set({ enabled })
    .where(eq(Schemas.tasks1.id, taskId))
    .returning()
    .then((r) => r[0]);
}

export async function getProjectTasksAllOfType(
  projectid: number,
  type: string,
) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectid),
        eq(Schemas.tasks1.type, type),
      ),
    );
}

export async function getProjectTasksAll(projectid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(and(eq(Schemas.tasks1.projectid, projectid)));
}

export async function getProjectTasks(projectid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectid),
        eq(Schemas.tasks1.enabled, true),
      ),
    )
    .orderBy(Schemas.tasks1.id);
}

export async function getProjectTask(projectid: number, specid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectid),
        eq(Schemas.tasks1.specid, specid),
      ),
    );
}

export async function getTask(taskId: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(and(eq(Schemas.tasks1.id, taskId)))
    .orderBy(Schemas.tasks1.id)
    .then((r) => r[0]);
}
