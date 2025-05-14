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
          "bg-backgroud",
          "bg-gradient-to-br from-cyan-400/20 to-indigo-600/20",
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
      <main
        className={cn(
          "grow flex flex-col gap-4 py-8 px-3 w-full mx-auto max-w-5xl",
          className,
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
