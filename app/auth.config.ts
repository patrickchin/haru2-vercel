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
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

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
