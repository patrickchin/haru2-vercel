import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser, getUserFull } from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authConfig } from "@/lib/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  // adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ token, session, newSession, trigger }) {
      // trigger update doesn't seem to work
      // if (trigger === "update") {

      const user = await getUser(session.user.email);
      session.user.image = user[0].avatarUrl;

      if (token) session.user.id = token.sub || "";
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials, req) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (!password) return null;

        const users = await getUserFull(email as string);
        if (users.length === 0) return null;

        const user = users[0];
        if (!user.password) return null;

        const passwordsMatch = await compare(
          password as string,
          user.password!,
        );
        if (!passwordsMatch) return null;

        const authuser: User = {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user?.avatarUrl || null,
        };
        return authuser;
      },
    }),
  ],
});
