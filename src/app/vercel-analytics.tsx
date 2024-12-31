"use client";
import { Analytics } from "@vercel/analytics/react";
import { useSession } from "next-auth/react";

export const VercelAnalytics = () => {
  const { data: session } = useSession();
  return (
    <Analytics
      beforeSend={(event) => {
        if (session?.user?.role === "admin") {
          return null;
        }
        return event;
      }}
    />
  );
};
