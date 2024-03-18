import React from "react";
import Footer from "./footer";
import Header from "./header";

export function SimpleLayout({ children } : { children : React.ReactNode; }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-r from-cyan-100 to-red-100">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export function CenteredLayout({ children } : { children : React.ReactNode; }) {
  return (
    <SimpleLayout>
      <div className="grow flex flex-col w-screen mx-auto max-w-7xl px-12">
        <div className="grow flex flex-col bg-background shadow-xl p-16">
          {children}
        </div>
      </div>
    </SimpleLayout>
  )
}
