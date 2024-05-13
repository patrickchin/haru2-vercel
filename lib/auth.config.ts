import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.avatarUrl = user.avatarUrl;
        token.avatarColor = user.avatarColor;
      }
      return token;
    },

    async session({ token, session }) {
      if (session.user && token) {
        session.user.id = token.sub || "";
        session.user.avatarUrl = token.avatarUrl;
        session.user.avatarColor = token.avatarColor;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
