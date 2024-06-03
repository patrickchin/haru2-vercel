import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: File) => f.size < 4_500_000);
}

export const NewProjectFormSchema = z.object({
  title: z.string().max(254),
  country: z.string(),
  buildingType: z.string(), // enum?
  buildingSubtype: z.string().optional(), // enum?
  description: z.string().min(1),
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

export const PhoneNumberRegex = /^\+?[0-9\s\-]+$/;

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(0, { message: "Name is required" }),
    phone: z
      .string()
      .min(4, { message: "Phone must contain at least 5 characters" })
      .max(32, { message: "Phone cannot contain more than 32 characters" })
      .regex(PhoneNumberRegex, { message: "Phone contains invalid characters" })
      .optional()
      .or(z.literal("")),
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

const LoginFormSchema = z
.object({
  email: z.string().min(0, { message: "Email is required" }).email(),
  password: z.string().optional(),
  otp: z.string().optional(),
})
.refine(
  (data) => {
    if (!data.password && !data.otp) {
      return false;
    }
    return true;
  },
  {
    message: "Password or OTP is required",
    path: ["password"],
  },
);

type FormFields = z.infer<typeof LoginFormSchema>;


const phoneOtpSchema = z.object({
  phone: z
    .string()
    .min(4, "Phone must contain at least 5 characters")
    .max(32, "Phone cannot contain more than 32 characters")
    .regex(PhoneNumberRegex, "Invalid phone number"),
  otp: z.string().min(6).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
});
const emailOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(5).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
});
const passwordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(7).max(100),
});
export const loginZodSchemas = {
  "phone": phoneOtpSchema,
  "email": emailOtpSchema,
  "password": passwordSchema,
}
