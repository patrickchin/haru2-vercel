import "server-only";

import { db } from "./_db";
import { and, desc, eq, getTableColumns, or } from "drizzle-orm";
import { HaruComment, HaruCommentNew } from "@/lib/types";
import {
  comments1,
  siteMembers1,
  siteReports1,
  users1,
} from "@/db/schema";

const HaruCommentColumns = {
  ...getTableColumns(comments1),
  user: {
    ...getTableColumns(users1),
  },
};

export async function getCommentsSectionRole({
  commentsSectionId,
  userId,
}: {
  commentsSectionId: number;
  userId: string;
}) {
  return db
    .select({ role: siteMembers1.role })
    .from(siteMembers1)
    .leftJoin(siteReports1, eq(siteReports1.siteId, siteMembers1.siteId))
    .where(
      and(
        eq(siteReports1.commentsSectionId, commentsSectionId),
        eq(siteMembers1.memberId, userId),
      ),
    )
    .limit(1)
    .then((r) => (r && r.length ? r[0].role : null));
}

export async function listCommentsFromSection(
  commentsSectionId: number,
): Promise<HaruComment[]> {
  return await db
    .select(HaruCommentColumns)
    .from(comments1)
    .leftJoin(users1, eq(users1.id, comments1.userId))
    .where(eq(comments1.commentsSectionId, commentsSectionId))
    .orderBy(desc(comments1.createdAt));
}

export async function addCommentToSection(
  commentsSectionId: number,
  userId: string,
  values: HaruCommentNew,
) {
  return await db
    .insert(comments1)
    .values({ ...values, commentsSectionId, userId })
    .returning()
    .then((r) => r[0]);
}
