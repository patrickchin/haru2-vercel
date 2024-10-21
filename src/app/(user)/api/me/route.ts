import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import * as db from "@/db";

// export const GET = auth(async function GET(req: NextAuthRequest) {
export async function GET(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const account = await db.getUserAccount(user.idn);
  return NextResponse.json(account);
}
