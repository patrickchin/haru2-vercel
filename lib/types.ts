import * as Schemas from "drizzle/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import * as db from "./db";

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: File) => f.size < 4_500_000);
}

export const NewProjectFormSchema = z.object({
  title: z.string().max(255),
  country: z.string(),
  buildingType: z.string(), // enum?
  buildingSubtype: z.string().optional(), // enum?
  description: z.string().min(2),
  files: z
    .any()
    .transform((f) => f as FileList)
    .optional()
    .refine(allFilesSmall, "Max file size 4.5MB"),

  lifestyle: z.string().optional(),
  future: z.string().optional(),
  energy: z.string().optional(),
  outdoors: z.string().optional(),
  security: z.string().optional(),
  maintenance: z.string().optional(),
  special: z.string().optional(),
});
export type NewProjectFormSchemaType = z.infer<typeof NewProjectFormSchema>;
export type NewProjectFormType = UseFormReturn<NewProjectFormSchemaType>;

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    phone: z
      .string()
      .min(5, { message: "Phone must contain at least 5 characters" })
      .max(32, { message: "Phone cannot contain more than 32 characters" })
      .regex(/^\+?[0-9\s-]+$/, { message: "Phone contains invalid characters" })
      .optional()
      .or(z.literal("")),
    email: z.string().min(1, { message: "Email is required" }).email(),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.confirmPassword === schema.password, {
    message: "Oops! Passwords don't match. Try again.",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export type DesignUserFull = typeof Schemas.users1.$inferSelect;
export type DesignUserBasic = Pick<
  DesignUserFull,
  "id" | "name" | "email" | "avatarUrl" | "avatarColor"
>;
export type DesignProject = typeof Schemas.projects1.$inferSelect;
export type DesignTeam = typeof Schemas.teams1.$inferSelect;
export type DesignTeamMember = typeof Schemas.teammembers1.$inferSelect;
export type DesignTaskSpec = typeof Schemas.taskspecs1.$inferSelect;
export type DesignTask = typeof Schemas.tasks1.$inferSelect;
export type DesignFile = typeof Schemas.files1.$inferSelect;
export type DesignTaskComment = typeof Schemas.taskcomments1.$inferSelect;
export type DesignTaskUserComment = Awaited<
  ReturnType<typeof db.getTaskComments>
>[0];

export const defaultTeams = [
  "legal",
  "architectural",
  "structural",
  "mep",
];

export const teamNames: Record<string, string> = {
  legal: "Legal",
  architectural: "Architectural",
  structural: "Structural",
  mep: "Mechanical, Electrical and Plumbing",
  other: "Other",
};
