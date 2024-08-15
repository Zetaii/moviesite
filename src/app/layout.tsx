import React from "react"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SearchBar from "./components/SearchBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PVZ Movie App",
  description: "A movie app built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-sky-950`}>
        <div className="flex min-h-screen">
          <Navbar className="w-64 bg-slate-800 text-white fixed top-0 left-0 h-full" />
          <div className="flex-1 flex flex-col ml-24">
            <SearchBar />
            <main className="flex-1 overflow-y-auto mt-16">
              {children}
            </main>{" "}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
