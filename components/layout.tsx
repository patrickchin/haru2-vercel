import React from "react";
import Footer from "./footer";
import Header from "./header";
import { cn } from "@/lib/utils";

export default function SimpleLayout({ children } : { children : React.ReactNode; }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-r from-cyan-100 to-blue-100">
        <div className="grow flex flex-col w-screen mx-auto max-w-6xl px-12">
          <div className="grow flex flex-col bg-background shadow-xl p-16">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

}