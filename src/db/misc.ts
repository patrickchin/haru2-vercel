import "server-only";

import { db } from "./_db";
import { feedback1 } from "./schema";

export async function addFeedback(values: { email?: string; message: string }) {
  return db.insert(feedback1).values(values);
}

export async function getFeedback() {
  return db.select().from(feedback1);
}
