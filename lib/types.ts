import * as Schemas from "drizzle/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { getTaskComments } from "./db";

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

export type DesignUser = typeof Schemas.users1.$inferSelect;
export type DesignProject = typeof Schemas.projects1.$inferSelect;
export type DesignTaskSpec = typeof Schemas.taskspecs1.$inferSelect;
export type DesignTask = typeof Schemas.tasks1.$inferSelect;
export type DesignFile = typeof Schemas.files1.$inferSelect;
// export type DesignTaskComment = typeof Schemas.taskcomments1.$inferSelect;
export type DesignTaskComment = Awaited<ReturnType<typeof getTaskComments>>[0];

export const teamNames: Record<string, string> = {
  legal: "Legal",
  architectural: "Architectural",
  structural: "Structural",
  mep: "Mechanical, Electrical and Plumbing",
  other: "Other",
};
