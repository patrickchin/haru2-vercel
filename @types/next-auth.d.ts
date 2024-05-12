import { DefaultSession } from "next-auth";

import { users1 } from "./../drizzle/schema";
interface Session {
  users1: {
    avatarUrl: string;
  } & DefaultSession["user"];
}
