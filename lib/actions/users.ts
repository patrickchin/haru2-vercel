"use server";

import * as db from "@/lib/db";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { deleteFileFromS3 } from "@/lib/s3";
import {
  LoginTypesEmail,
  LoginTypesPassword,
  LoginTypesPhone,
  RegisterSchema,
  RegisterSchemaType,
} from "@/lib/forms";
import { AuthError } from "next-auth";
import {
  CredentialsSigninError,
  InvalidInputError,
  UnknownError,
} from "@/lib/errors";
import { redirect } from "next/navigation";

export async function getAllUsers() {
  const session = await auth();
  if (!session?.user) return;
  switch (session.user.role) {
    case "client":
      break;
    case "designer":
      break;
    case "manager":
      break;
    case "admin":
      break;
  }
  // TODO separate users by organisation
  return db.getAllUsers();
}

export async function registerUser(data: RegisterSchemaType) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return InvalidInputError;
  }

  try {
    await db.createUserIfNotExists(data);
  } catch (error: unknown) {
    console.log(`Failed to register user ${error}`);
    return UnknownError;
  }

  redirect("/login");
}

export async function signInFromLogin(
  data: LoginTypesPhone | LoginTypesEmail | LoginTypesPassword,
) {
  try {
    return await signIn("credentials", {
      ...data,
      redirectTo: "/",
      redirect: false,
    }) as string;
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      // is there any need to distinguish further?
      // e.g. CredentialsSignin error
      return CredentialsSigninError;
    } else {
      return UnknownError;
    }
  }
}

export async function updateAvatarForUser(fileUrl: string | null) {
  const session = await auth();
  if (!session?.user) return;

  try {
    const { initial, updated } = await db.updateUserAvatar(session.user.idn, {
      avatarUrl: fileUrl,
    });

    if (initial && initial.avatarUrl) {
      const key = new URL(initial.avatarUrl).pathname.substring(1);
      await deleteFileFromS3(key);
    }
    return updated;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    throw error;
  }
}
