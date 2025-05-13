"use server";

import * as db from "@/db";
import { auth } from "@/lib/auth";
import { deleteFileFromS3 } from "@/lib/s3";

export async function onUserSignUp(userId?: string) {
  if (!userId) return;
  const session = await auth();
  if (!session?.user?.id) return;
  await db.addLogMessage({
    userId: session.user.id,
    message: `User ${session.user.name} (${session.user.email}) signed up`,
  });
  await db.acceptAllUserInvitations({ userId });
}

export async function getUser(userId?: string) {
  if (!userId) return;
  const session = await auth();
  if (!session?.user?.id) return;
  return db.getUser(userId, session.user.id);
}

export async function updateAvatarForUser(fileUrl: string | null) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
      const { initial, updated } = await db.updateUserAvatar(session.user.id, {
      image: fileUrl,
    });

    if (initial && initial.image) {
      const key = new URL(initial.image).pathname.substring(1);
      await deleteFileFromS3(key);
    }
    return updated;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    throw error;
  }
}
