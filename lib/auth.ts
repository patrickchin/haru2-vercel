import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import * as db from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authConfig } from "@/lib/auth.config";
import { AccountRole } from "@/lib/types";

declare module "next-auth" {
  interface User {
    idn: number;
    role?: AccountRole;
  }
}

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
      const user = await db.getUserAccountByEmail(session.user.email);
      session.user.id = token?.sub || "invalid";
      if (user) {
        session.user.idn = user.id;
        session.user.role = user.role ?? undefined;
        session.user.image = user.avatarUrl;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize({
        email,
        password,
        otp,
        phone,
      }: {
        email?: string;
        password?: string;
        otp?: string;
        phone?: string;
      }) {
        if (!email && !phone) return null;
        const user = email
          ? await db.getUserAccountByEmail(email)
          : phone
            ? await db.getUserAccountByPhone(phone)
            : undefined;
        if (!user) return null;

        let otpIsValid = false;
        let passwordsMatch = false;

        // Verify OTP if provided
        if (otp) {
          if (phone) {
            otpIsValid = await db.verifyOtp(phone, otp);
          }
          if (email) {
            otpIsValid = await db.verifyOtp(email, otp);
          }
        }

        // Verify password if OTP is not provided or is invalid
        if (password) {
          passwordsMatch = await compare(password, user.password!);
        }

        if (otpIsValid || passwordsMatch) {
          const authuser: User = {
            id: user.id.toString(),
            idn: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl || null,
            role: user.role || "client",
          };
          return authuser;
        }

        return null;
      },
    }),
  ],
});
