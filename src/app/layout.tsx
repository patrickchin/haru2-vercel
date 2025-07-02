import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AddFeedback } from "@/components/feedback";
import { ThemeProvider } from "@/components/theme-provider";
import { VercelAnalytics } from "./vercel-analytics";

let title = "Harpa Pro";
let description = "Plan and organize your construction projects";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("overflow-y-scroll", GeistSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <SpeedInsights />
            <VercelAnalytics />
          </SessionProvider>
        </ThemeProvider>
        <AddFeedback />
        <Toaster />
      </body>
    </html>
  );
}
