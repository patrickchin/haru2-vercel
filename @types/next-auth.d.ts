import NextAuth, { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatarUrl?: string | null;
    avatarColor?: string | null;
  }
}
