import * as Schemas from "@/db/schema";

export type AccountRole = (typeof Schemas.accountRoleEnum.enumValues)[number];
export type HaruUserBasic = typeof Schemas.users1.$inferSelect;
export type HaruUserDetailed = typeof Schemas.users1.$inferSelect & { email: string | null; };
export type HaruUserAccount = typeof Schemas.accounts1.$inferSelect & HaruUserBasic;
export type HaruFile = typeof Schemas.files1.$inferSelect & { uploader: HaruUserBasic | null; };
export type HaruComment = typeof Schemas.comments1.$inferSelect & { user?: HaruUserBasic | null; };
export type HaruLogMessage = typeof Schemas.logs1.$inferSelect;

export type HaruFileNew = Omit<typeof Schemas.files1.$inferInsert, "id">;
export type HaruCommentNew = Omit<typeof Schemas.comments1.$inferInsert, "id" | "createdAt">;
export type HaruLogMessageNew = Omit<typeof Schemas.logs1.$inferInsert, "id" | "createdAt">;