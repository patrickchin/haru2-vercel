import React from "react";
import Footer from "./footer";
import Header from "./header";

export default function SimpleLayout({ children } : { children : React.ReactNode; }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
        <div className="grow flex flex-col w-screen mx-auto max-w-7xl p-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )

}