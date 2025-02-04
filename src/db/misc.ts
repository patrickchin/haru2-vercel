import "server-only";

import { db } from "./_db";
import { feedback1, logs1 } from "./schema";
import { auth } from "@/lib/auth";
import { HaruLogMessageNew } from "@/lib/types";
import { desc } from "drizzle-orm";

export async function addFeedback(values: { email?: string; message: string }) {
  return db.insert(feedback1).values(values);
}

export async function getFeedback() {
  return db.select().from(feedback1);
}

export async function addLogMessage(values: HaruLogMessageNew) {
  const session = await auth();
  return db.insert(logs1).values({
    userId: session?.user?.idn,
    ...values,
  });
}

export async function listLogMessages() {
  return db.select().from(logs1).limit(1000).orderBy(desc(logs1.id));
}
