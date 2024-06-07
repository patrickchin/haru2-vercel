import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const auth = NextAuth(authConfig).auth;

export default auth((req) => {

  const publicPathnames: string[] = [
    "/",
    "/favicon.ico",
    "/login",
    "/register",
    "/new-project",
  ];
  const isPublic = publicPathnames.some((p) =>
    req.nextUrl.pathname === p,
  );

  if (!req.auth && !isPublic) {
    // TODO redirect to original url after logging in
    // req.nextUrl.searchParams.append();
    req.nextUrl.pathname = "/login";
    return Response.redirect(req.nextUrl);
  }

  if (req.auth) {
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")
    ) {
      // is this expected behaviour?
      req.nextUrl.pathname = "/";
      return Response.redirect(req.nextUrl);
    }
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
