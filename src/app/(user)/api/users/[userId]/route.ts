import { auth } from "@/lib/auth";
import { NextAuthRequest } from "next-auth/lib";
import { NextResponse } from "next/server";
import * as db from "@/db";

export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req.auth?.user) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const pathname = new URL(req.url).pathname.split("/");
  const userId = Number(pathname[3]);
  const user = await db.getUser(userId);
  // TODO check if user is in the same organisation,
  // to prevent any user searching up any other user
  return NextResponse.json(user);
});
