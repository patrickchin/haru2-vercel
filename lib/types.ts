import * as Schemas from "@/drizzle/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import * as db from "./db";

export type DesignUserBasic = NonNullable<
  Awaited<ReturnType<typeof db.getUserByEmail>>
>;
export type DesignUserDetailed = Awaited< // adds email
  ReturnType<typeof db.getTeamMembersDetailed>
>[0];
export type DesignProject = NonNullable<
  Awaited<ReturnType<typeof db.getProject>>
>;
export type DesignProjectUser = Awaited<
  ReturnType<typeof db.getUserProjects>
>[0];
export type DesignTeam = typeof Schemas.teams1.$inferSelect;
export type DesignTeamMember = typeof Schemas.teammembers1.$inferSelect;
export type DesignTaskSpec = typeof Schemas.taskspecs1.$inferSelect;
export type DesignTask = typeof Schemas.tasks1.$inferSelect;
export type DesignFile = Awaited<ReturnType<typeof db.getFilesForTask>>[0];
export type DesignTaskComment = Awaited<
  ReturnType<typeof db.getTaskComments>
>[0];

export const defaultTeams = ["legal", "architectural", "structural", "mep"];

export const teamNames: Record<string, string> = {
  legal: "Legal",
  architectural: "Architectural",
  structural: "Structural",
  mep: "Mechanical, Electrical and Plumbing",
  other: "Other",
};
