import { UseFormReturn } from "react-hook-form";
import { z } from "zod"

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: any) => f.size < 4_500_000);
}

export const NewProjectFormSchema = z.object({
  country: z.string(),
  buildingType: z.string(), // enum?
  buildingSubtype: z.string().optional(), // enum?
  description: z.string().min(2),
  files: z.any().transform((f) => f as FileList).optional().refine(allFilesSmall),
})
export type NewProjectFormSchemaType = z.infer<typeof NewProjectFormSchema>;
export type NewProjectFormType = UseFormReturn<NewProjectFormSchemaType>;