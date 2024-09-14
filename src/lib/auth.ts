import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import {
  getUserAccount,
  getUserAccountByEmail,
  getUserAccountByPhone,
  verifyOtp,
} from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { AccountRole } from "@/lib/types";
import { authorizeSchema } from "@/lib/forms";

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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.idn = user.idn;
        token.role = user.role;
        token.picture = user.image;
      }

      if (trigger === "update") {
        const dbuser = await getUserAccount(token.idn as number);
        if (dbuser) {
          token.sub = dbuser.id.toString();
          token.idn = dbuser.id;
          token.role = dbuser.role;
          token.picture = dbuser.avatarUrl;
        }
      }

      return token;
    },
    async session({ token, session }) {
      session.user.id = token.sub || "invalid";
      session.user.idn = token.idn as number;
      session.user.role = token.role as AccountRole;
      session.user.image = token.picture;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password, otp, phone } =
          authorizeSchema.parse(credentials);

        if (!email && !phone) return null;
        const user = email
          ? await getUserAccountByEmail(email)
          : phone
            ? await getUserAccountByPhone(phone)
            : undefined;
        if (!user) return null;

        let otpIsValid = false;
        let passwordsMatch = false;

        // Verify OTP if provided
        if (otp) {
          if (phone) {
            otpIsValid = await verifyOtp(phone, otp);
          }
          if (email) {
            otpIsValid = await verifyOtp(email, otp);
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
