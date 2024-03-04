import { UseFormReturn } from "react-hook-form";
import { z } from "zod"

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: File) => f.size < 4_500_000);
}

export const NewProjectFormSchema = z.object({
  title: z.string(),
  country: z.string(),
  buildingType: z.string(), // enum?
  buildingSubtype: z.string().optional(), // enum?
  description: z.string().min(2),
  files: z.any().transform(f => f as FileList).optional().refine(allFilesSmall),

  lifestyle: z.string().optional(),
  future: z.string().optional(),
  energy: z.string().optional(),
  outdoors: z.string().optional(),
  security: z.string().optional(),
  maintenance: z.string().optional(),
  special: z.string().optional(),
})
export type NewProjectFormSchemaType = z.infer<typeof NewProjectFormSchema>;
export type NewProjectFormType = UseFormReturn<NewProjectFormSchemaType>;

