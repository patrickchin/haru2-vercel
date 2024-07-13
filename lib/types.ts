import * as Schemas from "@/drizzle/schema";
import * as db from "./db";

export type DesignUserBasic = typeof Schemas.users1.$inferSelect;
export type DesignUserDetailed = typeof Schemas.users1.$inferSelect & {
  email: string | null;
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
export type DesignTask = typeof Schemas.tasks1.$inferSelect;
export type DesignFileNew = Omit<typeof Schemas.files1.$inferInsert, "id">;
export type DesignFile = typeof Schemas.files1.$inferSelect & {
  uploader: DesignUserBasic | null;
  task?: DesignTask | null;
  // task?: Omit<DesignTask, "description"> | null;
};
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
