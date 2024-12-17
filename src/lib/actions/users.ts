"use server";

import * as db from "@/db";
import { signIn, auth } from "@/lib/auth";
import { redirect, unauthorized } from "next/navigation";
import { compare, genSaltSync, hashSync } from "bcrypt-ts";
import { isRedirectError } from "next/dist/client/components/redirect-error";
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
import { demoSiteIds } from "@/lib/constants";

export async function getAllUsers() {
  const session = await auth();
  if (!session?.user) return;
  if (session.user.role === "admin") {
    // TODO separate users by organisation
    return db.getAllUsers();
  }
}

export async function getUser(userId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getUser(userId, session.user.idn);
}

export async function registerUser(data: RegisterSchemaType) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return InvalidInputError;
  }

  let newUser = undefined;
  try {
    newUser = await db.createUserIfNotExists(data);
  } catch (error: unknown) {
    console.log(`Failed to register user ${error}`);
    return UnknownError;
  }

  if (newUser) {
    for (let demoSiteId of demoSiteIds) {
      try {
        await db.addSiteMember({
          userId: newUser.id,
          siteId: demoSiteId,
          role: "member",
        });
      } catch (error: unknown) {
        console.log(
          `Failed to add new user to site ${demoSiteId}, the demo project`,
        );
      }
    }

    db.acceptAllUserInvitations({ userId: newUser.id });
  }

  redirect("/login");
}

export async function signInFromLogin(
  data: LoginTypesPhone | LoginTypesEmail | LoginTypesPassword,
) {
  const username = "phone" in data ? data.phone : data.email;
  const user =
    "phone" in data
      ? db.getUserByPhone(data.phone)
      : db.getUserByEmail(data.email);

  try {
    await signIn("credentials", {
      ...data,
      redirectTo: "/sites",
      redirect: true,
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      db.addlogMessage({
        message: `Successfull login: ${username}`,
        userId: (await user)?.id,
      });
      throw error;
    } else if (error instanceof AuthError) {
      db.addlogMessage({
        message: `Failed to login: ${username}`,
        userId: (await user)?.id,
      });
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

export async function updateUserPassword({
  oldPassword,
  newPassword,
  newPasswordConfirm,
}: {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  const session = await auth();
  if (!session?.user) unauthorized();
  if (newPassword != newPasswordConfirm)
    return { error: "Passwords do not match" };
  const userId = session.user.idn;
  const account = await db.getUserAccount(userId);
  if (!account) return { error: "Account not found" };
  const passwordsMatch =
    account.password === null || (await compare(oldPassword, account.password));
  if (passwordsMatch === true) {
    const salt = genSaltSync(10);
    const hash = hashSync(newPassword, salt);
    await db.updateUserPassword(userId, hash);
    db.addlogMessage({ message: "Changed password successfully" });
  } else {
    db.addlogMessage({ message: "Failed to update password" });
    return { error: "Failed to update password" };
  }
}
