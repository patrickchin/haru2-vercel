"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { defaultTeams } from "@/lib/types";

export async function createDefaultProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.createTeams(projectId, defaultTeams);
}

export async function createProjectTeam(projectId: number, type: string) {
  const session = await auth();
  if (!session?.user) return;
  return db.createTeam(projectId, type);
}

export async function deleteProjectTeam(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.deleteTeam(teamId);
}

export async function getProjectTeams(projectId: number) {
  const session = await auth();
  if (!session?.user) return;
  return await db.getProjectTeams(projectId);
}

export async function setTeamLead(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.setTeamLead(teamId, userId);
}

export async function addTeamMember(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  const newTeamMember = await db.addTeamMember(teamId, userId);
  return db.getTeamMembersDetailed(teamId);
}

export async function removeTeamMember(teamId: number, userId: number) {
  const session = await auth();
  if (!session?.user) return;
  const newTeamMember = await db.deleteTeamMember(teamId, userId);
  return db.getTeamMembersDetailed(teamId);
}

export async function getTeamMembersDetailed(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTeamMembersDetailed(teamId);
}

export async function getTeamMembers(teamId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getTeamMembers(teamId);
}

