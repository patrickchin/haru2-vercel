import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    session({ session, user }) {
      session.user.role = "client";
      return session;
    },
  },
});
