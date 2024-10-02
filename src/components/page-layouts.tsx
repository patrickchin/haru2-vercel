import React from "react";
import Footer from "./footer";
import Header from "./header";
import { cn } from "@/lib/utils";

export function GradientLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={cn(
          "grow flex flex-col justify-center items-center",
          "bg-gradient-to-br from-cyan-100 to-indigo-200",
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function DefaultLayout({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-br from-background to-muted">
        <div
          className={cn(
            "grow flex flex-col gap-4 py-8 px-0 sm:px-8 w-screen mx-auto max-w-5xl",
            className,
          )}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
