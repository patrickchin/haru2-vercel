import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/_db";
import authConfig from "./auth.config";
import { onUserSignUp } from "./actions";
import { getUserInternal } from "@/db";
import { AccountRole } from "./types";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: AccountRole;
  }
}

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
      }

      if (trigger === "signUp") {
        await onUserSignUp(user.id);
      }

      if (trigger) {
        const dbuser = await getUserInternal(user.id);
        if (!dbuser) return null;
        token.id = dbuser.id;
        token.role = dbuser.role;
        token.picture = dbuser.image;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as AccountRole) || "guest";
      return session;
    },
  },
  ...authConfig,
});
