import * as Schemas from "@/drizzle/schema";

export type HaruUserBasic = typeof Schemas.users1.$inferSelect;
export type HaruUserDetailed = typeof Schemas.users1.$inferSelect & {
  email: string | null;
};
export type HaruFileNew = Omit<typeof Schemas.files1.$inferInsert, "id">;
export type HaruFile = typeof Schemas.files1.$inferSelect & {
  uploader: HaruUserBasic | null;
};