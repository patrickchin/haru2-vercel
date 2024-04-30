import React from "react";
import Footer from "./footer";
import Header from "./header";
import { cn } from "@/lib/utils";

export function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={cn(
          "grow flex flex-col justify-center items-center",
          "bg-gradient-to-r from-cyan-100 to-red-100",
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-br from-background to-accent">
        <div className="grow flex flex-col gap-12 w-screen mx-auto max-w-6xl pt-16 pb-8 px-4 sm:px-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function WideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-br from-background to-accent">
        {children}
      </main>
      <Footer />
    </div>
  );
}
