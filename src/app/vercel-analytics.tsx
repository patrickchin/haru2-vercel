"use client";
import { Analytics } from "@vercel/analytics/react";
import { Session } from "next-auth";

export const VercelAnalytics = ({ session }: { session?: Session | null }) => {
  return (
    <Analytics
      beforeSend={(event) => {
        if (session?.user?.role === "admin") return null;
        return event;
      }}
    />
  );
};
