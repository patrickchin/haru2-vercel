"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import { DesignProject, defaultTeams } from "@/lib/types";
import { Session } from "next-auth";

function canViewProjectTeams(
  session?: Session | null,
  project?: DesignProject,
) {
  if (!project || !session?.user) return false;
  const isOwner = project?.userId === session.user.idn;
  switch (session.user.role) {
    case "client":
      return isOwner;
    case "designer":
      return true; // TODO only if my project manager is my manager
    case "manager":
      return true;
    case "admin":
      return true;
  }
}

function canEditProjectTeams(
  session?: Session | null,
  project?: DesignProject,
) {
  if (!project || !session?.user) return false;
  const isOwner = project?.userId === session.user.idn;
  switch (session.user.role) {
    case "client":
      return isOwner;
    case "designer":
      return true; // TODO only if my project manager is my manager
    case "manager":
      return true;
    case "admin":
      return true;
  }
}

export async function getProjectTeams(projectId: number) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (canViewProjectTeams(session, project))
    return await db.getProjectTeams(projectId);
}

export async function getTeamMembersDetailed(teamId: number) {
  const session = await auth();
  const team = await db.getTeam(teamId);
  if (!team.projectId) return;
  const project = await db.getProject(team.projectId);
  if (canViewProjectTeams(session, project))
    return db.getTeamMembersDetailed(teamId);
}

export async function getTeamMembers(teamId: number) {
  const session = await auth();
  const team = await db.getTeam(teamId);
  if (!team.projectId) return;
  const project = await db.getProject(team.projectId);
  if (canViewProjectTeams(session, project)) return db.getTeamMembers(teamId);
}

async function canEditProjectTeamsFromTeamId(teamId: number) {
  const session = await auth();
  const team = await db.getTeam(teamId);
  if (!team.projectId) return;
  const project = await db.getProject(team.projectId);
  return canEditProjectTeams(session, project);
}

export async function createDefaultProjectTeams(projectId: number) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (canViewProjectTeams(session, project))
    return db.createTeams(projectId, defaultTeams);
}

export async function createProjectTeam(projectId: number, type: string) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (canViewProjectTeams(session, project))
    return db.createTeam(projectId, type);
}

export async function deleteProjectTeam(teamId: number) {
  if (await canEditProjectTeamsFromTeamId(teamId)) return db.deleteTeam(teamId);
}

export async function setTeamLead(teamId: number, userId: number) {
  if (await canEditProjectTeamsFromTeamId(teamId))
    return db.setTeamLead(teamId, userId);
}

export async function addTeamMember(teamId: number, userId: number) {
  if (await canEditProjectTeamsFromTeamId(teamId)) {
    const newTeamMember = await db.addTeamMember(teamId, userId);
    return db.getTeamMembersDetailed(teamId);
  }
}

export async function removeTeamMember(teamId: number, userId: number) {
  if (await canEditProjectTeamsFromTeamId(teamId)) {
    const newTeamMember = await db.deleteTeamMember(teamId, userId);
    return db.getTeamMembersDetailed(teamId);
  }
}
