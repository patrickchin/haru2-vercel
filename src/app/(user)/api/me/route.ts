import { auth } from "@/lib/auth";
import { NextAuthRequest } from "next-auth/lib";
import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export const GET = auth(async function GET(req: NextAuthRequest) {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const account = await db.getUserAccount(user.idn);
  return NextResponse.json(account);
});
