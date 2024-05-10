import { NextAuthConfig } from "next-auth";
import { getUserAvater } from "./db";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user !== undefined) session.user.id = token.sub || "";

      return session;
    },
  },
} satisfies NextAuthConfig;
