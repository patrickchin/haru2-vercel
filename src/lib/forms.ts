import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: File) => f.size < 4_500_000);
}

export const NewProjectFormSchema = z.object({
  title: z.string().max(254),
  country: z.string(),
  buildingType: z.string(), // enum?
  buildingSubtype: z.string().optional(), // enum?
  description: z
    .string()
    .min(
      1,
      "Please add a project description, this can be edited after submition",
    ),
  files: z
    .any()
    .transform((f) => f as FileList)
    .optional()
    .refine(allFilesSmall, "Max file size 3.5MB"),

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

export const phoneNumberZod = z
  .string()
  .refine(isValidPhoneNumber, { message: "Invalid phone number" });
export const otpZod = z
  .string()
  .min(6, "Passcode must be 6 digits long")
  .max(6, "Passcode must be 6 digits long")
  .regex(/^\d+$/, "Passcode must be digits only");

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(0, { message: "Name is required" }),
    phone: phoneNumberZod.optional().or(z.literal("")),
    email: z.string().min(0, { message: "Email is required" }).email(),
    password: z
      .string()
      .min(7, { message: "Password must contain at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.confirmPassword === schema.password, {
    message: "Oops! Passwords don't match. Try again.",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchemaPhone = z.object({
  phone: phoneNumberZod,
  otp: z.string().min(6).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
});
export const LoginSchemaEmail = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(5).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
});
export const LoginSchemaPassword = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
export type LoginTypesPhone = { phone: string; otp: string };
export type LoginTypesEmail = { email: string; otp: string };
export type LoginTypesPassword = { email: string; password: string };

const registerPhoneOtpSchema = z.object({
  name: z.string().trim().min(0, { message: "Name is required" }),
  phone: phoneNumberZod,
  otp: otpZod,
});
const registerEmailOtpSchema = z.object({
  name: z.string().trim().min(0, { message: "Name is required" }),
  email: z.string().email("Invalid email address"),
  otp: otpZod,
});
const registerPasswordSchema = z
  .object({
    name: z.string().trim().min(0, { message: "Name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(7).max(100),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.confirmPassword === schema.password, {
    message: "Oops! Passwords don't match. Try again.",
    path: ["confirmPassword"],
  });
export const registerZodSchemas = {
  phone: registerPhoneOtpSchema,
  email: registerEmailOtpSchema,
  password: registerPasswordSchema,
};

export const ManageTaskEditEstimatesSchema = z.object({
  duration: z.coerce.number(),
  cost: z.coerce.number(),
});
export type ManageTaskEditEstimatesType = z.infer<
  typeof ManageTaskEditEstimatesSchema
>;

export const addSiteSchema = z.object({
  title: z.string(),
  type: z.string(),
  countryCode: z.string().min(2).max(2),
  address: z.string().optional(),
  postcode: z.string().optional(),
  description: z.string().optional(),
});
export type AddSiteType = z.infer<typeof addSiteSchema>;

export const updateSiteMembersSchema = z.object({
  managerName: z.string().optional(),
  managerPhone: phoneNumberZod.optional(),
  managerEmail: z.string().email().optional(),
  contractorName: z.string().optional(),
  contractorPhone: phoneNumberZod.optional(),
  contractorEmail: z.string().email().optional(),
  supervisorName: z.string().optional(),
  supervisorPhone: phoneNumberZod.optional(),
  supervisorEmail: z.string().email().optional(),
});
export type UpdateSiteMembersType = z.infer<typeof updateSiteMembersSchema>;
