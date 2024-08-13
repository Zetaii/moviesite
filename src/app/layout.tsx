import type { Metadata } from "next"
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900`}>
        {" "}
        {/* Add bg-slate-800 here */}
        <div className="flex">
          <div className="w-16">
            <Navbar />
          </div>
          <div className="flex-1">
            <SearchBar />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
