import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import postgres from "postgres";

import * as Schemas from "@/drizzle/schema";
import { DesignTaskNew } from "@/lib/types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

export async function createTaskSpecs(
  values: (typeof Schemas.taskSpecs1.$inferInsert)[],
) {
  return await db
    .insert(Schemas.taskSpecs1)
    .values(values)
    .onConflictDoNothing()
    .returning();
}

export async function getTaskSpecsOfType(type: string) {
  return await db
    .select()
    .from(Schemas.taskSpecs1)
    .where(eq(Schemas.taskSpecs1.type, type));
}

export async function getTaskSpecs() {
  return await db.select().from(Schemas.taskSpecs1);
}

export async function getTaskSpec(specId: number) {
  return await db
    .select()
    .from(Schemas.taskSpecs1)
    .where(eq(Schemas.taskSpecs1.id, specId))
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
      .where(eq(Schemas.tasks1.projectId, projectId))
      .limit(1);
    if (existingTasks.length > 0) return; // or throw error?

    const specs = await tx.select().from(Schemas.taskSpecs1);
    const tasks = specs.map((spec) => {
      return {
        specId: spec.id,
        projectId: projectId,
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
        eq(Schemas.tasks1.projectId, projectId),
        eq(Schemas.tasks1.specId, specId),
      ),
    )
    .returning()
    .then((r) => r[0]);
}

export async function updateProjectTask(taskId: number, values: DesignTaskNew) {
  return await db
    .update(Schemas.tasks1)
    .set(values)
    .where(eq(Schemas.tasks1.id, taskId))
    .returning()
    .then((r) => r[0]);
}

export async function getProjectTasksAllOfType(
  projectId: number,
  type: string,
) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectId, projectId),
        eq(Schemas.tasks1.type, type),
      ),
    );
}

export async function getProjectTasksAll(projectId: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(and(eq(Schemas.tasks1.projectId, projectId)));
}

export async function getProjectTasks(projectId: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectId, projectId),
        eq(Schemas.tasks1.enabled, true),
      ),
    )
    .orderBy(Schemas.tasks1.id);
}

export async function getProjectTask(projectId: number, specId: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectId, projectId),
        eq(Schemas.tasks1.specId, specId),
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
