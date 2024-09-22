import * as Schemas from "@/drizzle/schema";

export type AccountRole = (typeof Schemas.accountRoleEnum.enumValues)[number];
export type HaruUserBasic = typeof Schemas.users1.$inferSelect;
export type HaruUserDetailed = typeof Schemas.users1.$inferSelect & {
  email: string | null;
};
export type HaruFileNew = Omit<typeof Schemas.files1.$inferInsert, "id">;
export type HaruFile = typeof Schemas.files1.$inferSelect & {
  uploader: HaruUserBasic | null;
};
// is this a good idea?
export const nullHaruFile: HaruFile = {
  id: 0,
  uploaderId: null,
  filename: "",
  filesize: 0,
  url: null,
  type: "",
  uploadedAt: new Date(),
  uploader: {
    id: 0,
    name: "",
    avatarUrl: null,
  },
};