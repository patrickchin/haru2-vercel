"use server";

import * as db from "@/db";
import { getSiteMemberRole } from "@/lib/actions/sites";
import { viewSiteRoles } from "@/lib/permissions";
import { HaruCommentNew } from "@/lib/types";
import { auth } from "@/lib/auth";

export async function listCommentsFromSection(commentsSectionId: number) {
  const role = await getSiteMemberRole({ commentsSectionId });
  if (viewSiteRoles.includes(role)) {
    return db.listCommentsFromSection(commentsSectionId);
  }
}

export async function addCommentToSection(
  commentsSectionId: number,
  values: HaruCommentNew,
) {
  const session = await auth();
  if (!session?.user.id) return;
  const role = await getSiteMemberRole({ commentsSectionId });
  if (viewSiteRoles.includes(role)) {
    return db.addCommentToSection(commentsSectionId, session.user.id, values);
  }
}
