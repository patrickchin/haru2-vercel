import * as Schemas from "@/drizzle/schema";
import * as db from "@/lib/db";
import {
  HaruUserBasic,
  HaruFile,
  HaruUserDetailed,
  HaruFileNew,
} from "./common";

export type DesignUserBasic = HaruUserBasic;
export type DesignUserDetailed = HaruUserDetailed;
export type DesignFileNew = HaruFileNew;
export type DesignFile = HaruFile & {
  task?: DesignTask | null; // maybe this should not be in this definition?
  // task?: Omit<DesignTask, "description"> | null;
};

export type DesignProject = NonNullable<
  Awaited<ReturnType<typeof db.getProject>>
>;
export type DesignProjectUser = Awaited<
  ReturnType<typeof db.getUserProjects>
>[0];
export type DesignTeam = Omit<typeof Schemas.teams1.$inferSelect, "lead"> & {
  lead: DesignUserBasic | null;
};
export type DesignTeamMember = typeof Schemas.teammembers1.$inferSelect;
export type DesignTaskSpec = typeof Schemas.taskspecs1.$inferSelect;
export type DesignTaskNew = Omit<
  typeof Schemas.tasks1.$inferInsert,
  "id" | "specid" | "projectid"
>;
export type DesignTask = typeof Schemas.tasks1.$inferSelect;
export type DesignCommentSection = typeof Schemas.commentSections1.$inferSelect;
export type DesignCommentNew = Omit<
  typeof Schemas.comments1.$inferInsert,
  "id" | "sectionId"
>;
export type DesignComment = typeof Schemas.comments1.$inferSelect & {
  user: DesignUserBasic | null;
};

export type AccountRole = (typeof Schemas.accountRoleEnum.enumValues)[number];

export const defaultTeams = ["legal", "architectural", "structural", "mep"];

export const teamNames: Record<string, string> = {
  legal: "Legal",
  architectural: "Architectural",
  structural: "Structural",
  mep: "Mechanical, Electrical and Plumbing",
  other: "Other",
};
