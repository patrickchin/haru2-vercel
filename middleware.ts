import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const auth = NextAuth(authConfig).auth;

export default auth((req) => {
  const publicPathnames: string[] = [
    "/",
    "/login",
    "/register",
    "/new-project",
  ];
  const isPublic = publicPathnames.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );
  if (!isPublic && !req.auth) {
    const loginPath = "/login";
    if (!req.nextUrl.pathname.startsWith(loginPath)) {
      req.nextUrl.pathname = loginPath;
      return Response.redirect(req.nextUrl);
    }
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
