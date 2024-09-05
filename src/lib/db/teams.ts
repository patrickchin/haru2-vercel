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
import { getAllUsers } from "./users";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

export async function createTeams(projectId: number, types: string[]) {
  const values = types.map((type) => {
    return { projectId: projectId, type };
  });
  return db.transaction(async (tx) => {
    const existingTeam = await tx
      .select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectId, projectId))
      .limit(1);
    if (existingTeam.length > 0) return;
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function createTeam(projectId: number, type: string) {
  return db
    .insert(Schemas.teams1)
    .values({ projectId: projectId, type })
    .returning();
}

export async function deleteTeam(teamId: number) {
  const deletedTeam = await db.transaction(async (tx) => {
    await tx
      .delete(Schemas.teamMembers1)
      .where(eq(Schemas.teamMembers1.teamId, teamId))
      .returning();
    return await tx
      .delete(Schemas.teams1)
      .where(eq(Schemas.teams1.id, teamId))
      .returning()
      .then((r) => r[0]);
  });
  return deletedTeam;
}

export async function getProjectTeams(projectId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.teams1),
      lead: getTableColumns(Schemas.users1),
    })
    .from(Schemas.teams1)
    .leftJoin(Schemas.users1, eq(Schemas.teams1.lead, Schemas.users1.id))
    .where(eq(Schemas.teams1.projectId, projectId));
}

export async function getProjectTeamsEnsureDefault(projectId: number) {
  return db.transaction(async (tx) => {
    const teams = await tx
      .select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectId, projectId));
    if (teams.length > 0) return teams;

    const values = defaultTeams.map((teamType) => {
      return { projectId: projectId, type: teamType };
    });
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function getTeamId(projectId: number, type: string) {
  // may
  return db
    .select()
    .from(Schemas.teams1)
    .where(
      and(
        eq(Schemas.teams1.projectId, projectId),
        eq(Schemas.teams1.type, type),
      ),
    );
}

export async function setTeamLead(teamId: number, userId: number) {
  return db
    .update(Schemas.teams1)
    .set({ lead: userId })
    .where(eq(Schemas.teams1.id, teamId))
    .returning();
}

export async function addTeamMember(teamId: number, userId: number) {
  return db
    .insert(Schemas.teamMembers1)
    .values({
      teamId,
      userId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function deleteTeamMember(teamId: number, userId: number) {
  return await db
    .delete(Schemas.teamMembers1)
    .where(
      and(
        eq(Schemas.teamMembers1.teamId, teamId),
        eq(Schemas.teamMembers1.userId, userId),
      ),
    )
    .returning();
}

export async function getTeamMembers(teamId: number) {
  return await db
    .select({ ...getTableColumns(Schemas.users1) })
    .from(Schemas.users1)
    .leftJoin(
      Schemas.teamMembers1,
      eq(Schemas.teamMembers1.userId, Schemas.users1.id),
    )
    .where(eq(Schemas.teamMembers1.teamId, teamId));
}

export async function getTeam(teamId: number) {
  return await db
    .select()
    .from(Schemas.teams1)
    .where(eq(Schemas.teams1.id, teamId))
    .then((r) => r[0]);
}

export async function getTeamMembersDetailed(teamId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
      email: Schemas.accounts1.email,
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
    .leftJoin(
      Schemas.teamMembers1,
      eq(Schemas.teamMembers1.userId, Schemas.users1.id),
    )
    .where(eq(Schemas.teamMembers1.teamId, teamId));
}
