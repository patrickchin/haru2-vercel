"use server";

import * as db from "@/db";
import { auth } from "@/lib/auth";

export async function addFeedback(values: { email?: string; message: string }) {
  return db.addFeedback(values);
}

export async function getFeedback() {
  const session = await auth();
  if (session?.user?.role === "admin") {
    return db.getFeedback();
  }
}
