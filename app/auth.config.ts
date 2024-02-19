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

    async session({ session, user, token }) {
      if (session.user !== undefined)
        session.user.id = Number(token.sub);

      return session
    },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   // console.log( token, user, account, profile, isNewUser );
    //   return token
    // },

    authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user;
      const pathname: string = nextUrl.pathname;

      const isPublic =
        pathname === '/' ||
        pathname === '/_not-found' ||
        pathname === '/job-posting' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/team' ||
        pathname.startsWith('/job-posting') ||
        // pathname.startsWith('/assets') ||
        false;

      return isPublic || isLoggedIn;
    },

  },
} satisfies NextAuthConfig;
