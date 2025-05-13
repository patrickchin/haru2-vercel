import NextAuth, { type DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/_db";
import authConfig from "./auth.config";
import { getUser } from "./actions";
import assert from "assert";
import { acceptAllUserInvitations, addLogMessage } from "@/db";

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
    async jwt({ token, user, trigger }) {
      if (user) {
        assert(user.id, "user.id is required");

        if (trigger === "signUp") {
          addLogMessage({
            userId: user.id,
            message: `User ${user.name} (${user.email}) signed up`,
          });
          await acceptAllUserInvitations({ userId: user.id });
        }

        const dbUser = await getUser(user.id);
        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
          token.picture = dbUser.image;
        } else {
          console.error("User not found in database", user);
        }
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
