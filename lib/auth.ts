import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUserAccountByEmail, getUserAccountByPhone, getUserByEmail, verifyOtp } from "@/lib/db";
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
      const user = await getUserByEmail(session.user.email);
      session.user.image = user?.avatarUrl ?? null;
      session.user.id = token?.sub || "";
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const otp = credentials.otp as string;
        const phone = credentials.phone as string


        if (!email && !phone) return null;
        let users;

        if(email){
          users = await getUserAccountByEmail(email);
          if (users.length === 0) return null;
        }else if(phone){
          users = await getUserAccountByPhone(phone);
          if (users.length === 0) return null;
        }

       if(users !== undefined && users.length !== 0){
        const user = users[0];
        let otpIsValid = false;
        let passwordsMatch = false;

        // Verify OTP if provided
        if (otp) {
          const phone = user.phone;
          if (phone) {
            otpIsValid = await verifyOtp(phone, otp);
          }
        }

        // Verify password if OTP is not provided or is invalid
        if (password) {
          passwordsMatch = await compare(password, user.password!);
        }

        if (otpIsValid || passwordsMatch) {
          const authuser: User = {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatarUrl || null,
          };
          return authuser;
        }
       }

        

        return null;
      },
    }),
  ],
});
