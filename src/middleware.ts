import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const protectedPathnames: string[] = ["/sites", "/settings"];
  const isProtected = protectedPathnames.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );

  if (!req.auth && isProtected) {
    // TODO redirect to original url after logging in
    // req.nextUrl.searchParams.append();
    req.nextUrl.pathname = "/login";
    return Response.redirect(req.nextUrl);
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
