import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUserAccountByEmail, getUserByEmail } from "@/lib/db";
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
        
        const { email, password, otp } = credentials;
        
        
        if (!email) return null;

        const users = await getUserAccountByEmail(email as string);
        if (users.length === 0) return null;

        const user = users[0];
        
        // Verify OTP if provided
        if (otp) {

          const phone = user.phone;
          
          if (!phone) return null;
          const otpIsValid = await verifyOtp(phone, otp);
      
          if (otpIsValid) {
            
            const authuser: User = {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.avatarUrl || null,
            };
            return authuser;
          }
        }

        // Verify password if OTP is not provided or is invalid
        if (password) {
          const passwordsMatch = await compare(password, user.password!);
          if (passwordsMatch) {
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
