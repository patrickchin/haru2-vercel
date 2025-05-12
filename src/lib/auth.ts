import NextAuth, { type DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/_db";
import authConfig from "./auth.config";
import { getUser } from "./actions";
import assert from "assert";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        assert(user.id, "user.id is required");
        const dbUser = await getUser(user.id);
        assert(dbUser, "dbUser is required");
        token.sub = dbUser.id;
        token.role = dbUser.role;
        token.picture = dbUser.image;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  ...authConfig,
});
