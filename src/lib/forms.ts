import { z, ZodType } from "zod";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { createInsertSchema } from "drizzle-zod";
import { SiteDetailsNew, SiteNew } from "./types";
import * as Schemas from "@/drizzle/schema";

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: File) => f.size < 4_500_000);
}

export const phoneNumberZod = z
  .string()
  .refine(isPossiblePhoneNumber, { message: "Invalid phone number" });
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
export const authorizeSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phone: phoneNumberZod.optional(),
    otp: z
      .string()
      .min(6)
      .max(6)
      .regex(/^\d+$/, "OTP must be 6 digits")
      .optional(),
    password: z.string().optional(),
  })
  .refine((schema) => !schema.phone, {
    message: "Mobile OTP has been temporarily disabled",
  })
  // .refine((schema) => !!schema.email === !!schema.password, {
  //   message: "Only email and password supported for now",
  // })
  .refine((schema) => !!schema.email !== !!schema.phone, {
    message: "Needs to specify one of email or phone number",
  })
  .refine((schema) => !!schema.otp !== !!schema.password, {
    message: "Needs to specify one of otp or password",
  });

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

export const changePasswordSchema = z.object({
  password: z.string(),
  passwordConfirm: z.string(),
  newPassword: z.string(),
});
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const zSiteNew = createInsertSchema(Schemas.sites1).pick({
  type: true,
  title: true,
  countryCode: true,
}) satisfies ZodType<SiteNew>;
export const zSiteDetailsNew = createInsertSchema(Schemas.siteDetails1).pick({
  address: true,
  description: true,
}) satisfies ZodType<SiteDetailsNew>;

export const zSiteNewBoth = zSiteNew.and(zSiteDetailsNew);
export type zSiteNewBothType = z.infer<typeof zSiteNewBoth>;

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
