import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

let title = "HarpaPro";
let description = "Plan and organise and your construction projects";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={cn("", GeistSans.variable)}>
        <SpeedInsights />
        <Analytics />
        <SessionProvider session={session}>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
