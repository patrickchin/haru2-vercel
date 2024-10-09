import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { notFound } from "next/navigation";

const auth = NextAuth(authConfig).auth;

export default auth((req) => {
  const publicPathnames: string[] = [
    "/",
    "/favicon.ico",
    "/login",
    "/register",
    "/register2",
  ];
  const isPublic = publicPathnames.some((p) => req.nextUrl.pathname === p);

  if (!req.auth && !isPublic) {
    // TODO redirect to original url after logging in
    // req.nextUrl.searchParams.append();
    req.nextUrl.pathname = "/login";
    return Response.redirect(req.nextUrl);
  }

  if (req.auth) {
    /*
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")
    ) {
      // is this expected behaviour?
      req.nextUrl.pathname = "/sites";
      return Response.redirect(req.nextUrl);
    }
    */

    /*
    // TODO maybe match the full path?
    if (
      req.nextUrl.pathname.endsWith("/edit") ||
      req.nextUrl.pathname.endsWith("/new")
    ) {
      // role doesn't seem to exist here???
      console.log("my current role is ", req.auth.user);
      if (
        req.auth.user?.role !== "admin" &&
        req.auth.user?.role !== "supervisor"
      ) {
        // TODO what about a 401?
        req.nextUrl.pathname = "/_error";
        return Response.redirect(req.nextUrl);
      }
    }
    */
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
