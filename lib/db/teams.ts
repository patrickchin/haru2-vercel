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


export async function createTeams(projectId: number, types: string[]) {
  const values = types.map((type) => {
    return { projectid: projectId, type };
  });
  return db.transaction(async (tx) => {
    const existingTeam = await tx
      .select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectid, projectId))
      .limit(1);
    if (existingTeam.length > 0) return;
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function createTeam(projectId: number, type: string) {
  return db
    .insert(Schemas.teams1)
    .values({ projectid: projectId, type })
    .returning();
}

export async function deleteTeam(teamId: number) {
  const deletedTeam = await db.transaction(async (tx) => {
    await tx
      .delete(Schemas.teammembers1)
      .where(eq(Schemas.teammembers1.teamid, teamId))
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
    .where(eq(Schemas.teams1.projectid, projectId));
}

export async function getProjectTeamsEnsureDefault(projectId: number) {
  return db.transaction(async (tx) => {
    const teams = await tx
      .select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectid, projectId));
    if (teams.length > 0) return teams;

    const values = defaultTeams.map((teamType) => {
      return { projectid: projectId, type: teamType };
    });
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function getTeamId(projectid: number, type: string) {
  // may
  return db
    .select()
    .from(Schemas.teams1)
    .where(
      and(
        eq(Schemas.teams1.projectid, projectid),
        eq(Schemas.teams1.type, type),
      ),
    );
}

export async function setTeamLead(teamid: number, userid: number) {
  return db
    .update(Schemas.teams1)
    .set({ lead: userid })
    .where(eq(Schemas.teams1.id, teamid))
    .returning();
}

export async function addTeamMember(teamid: number, userid: number) {
  return db
    .insert(Schemas.teammembers1)
    .values({
      teamid,
      userid,
    })
    .onConflictDoNothing()
    .returning();
}

export async function deleteTeamMember(teamid: number, userid: number) {
  return await db
    .delete(Schemas.teammembers1)
    .where(
      and(
        eq(Schemas.teammembers1.teamid, teamid),
        eq(Schemas.teammembers1.userid, userid),
      ),
    )
    .returning();
}

export async function getTeamMembers(teamId: number) {
  return await db
    .select({ ...getTableColumns(Schemas.users1) })
    .from(Schemas.users1)
    .leftJoin(
      Schemas.teammembers1,
      eq(Schemas.teammembers1.userid, Schemas.users1.id),
    )
    .where(eq(Schemas.teammembers1.teamid, teamId));
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
      Schemas.teammembers1,
      eq(Schemas.teammembers1.userid, Schemas.users1.id),
    )
    .where(eq(Schemas.teammembers1.teamid, teamId));
}

