import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/_db";
import authConfig from "./auth.config";
import {
  acceptAllUserInvitations,
  addLogMessage,
  addSiteMember,
  getUserInternal,
} from "@/db";
import { AccountRole } from "./types";
import { demoSiteIds } from "./constants";

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

      const dbuser = await getUserInternal(token.id as string);
      if (!dbuser) {
        console.error("User not found in database", token);
        return null;
      }
      token.id = dbuser.id;
      token.role = dbuser.role;
      token.picture = dbuser.image;

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as AccountRole) || "guest";
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await addLogMessage({
        userId: user.id,
        message: `User ${user.name} (${user.email}) signed up`,
      });
      const userId = user.id;

      if (!userId) {
        console.error("User ID is not defined");
        return;
      }

      await Promise.all(
        demoSiteIds.map(async (siteId) => {
          addSiteMember({ siteId, userId, role: "member" });
        }),
      );
      await acceptAllUserInvitations({ userId });
    },
  },
  ...authConfig,
});
