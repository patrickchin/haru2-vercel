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
    // async jwt({ token, user }): Promise<any> {
    //   if (user) {
    //     return {
    //       ...token,
    //       avatarUrl: user.avatarUrl,
    //       avatarColor: user.avatarColor,
    //     };
    //   }
    //   return token;
    // },
    async session({ token, user, session }) {
      if (session.user !== undefined) session.user.id = token.sub || "";

      return session;
    },
  },
} satisfies NextAuthConfig;
