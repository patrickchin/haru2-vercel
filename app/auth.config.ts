import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {

    authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user;

      const isOnDashboard =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/jobs') ||
        nextUrl.pathname.startsWith('/job') ||
        false;

      if (isOnDashboard) {
         if (isLoggedIn)
          return true;
        else
          return false;
      }

      return true;
    },

    // async redirect({ url, baseUrl }) {
    //   // TODO how to specify callbackUrl in signOut function?
    //   return baseUrl;
    // },

  },
} satisfies NextAuthConfig;
