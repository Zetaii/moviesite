"use client"
import React, { useEffect, useState } from "react"
import {
  Clapperboard,
  Film,
  Hash,
  Heart,
  Home,
  Layers,
  Mail,
  MessageCircleMore,
  ScrollText,
  Tv,
} from "lucide-react"
import Link from "next/link"
import { auth } from "../utils/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="sticky top-0 h-screen bg-slate-700 text-center">
      <div className="flex flex-col gap-6 text-white items-center">
        <Link
          href="/"
          className="text-lg font-semibold mt-6 border-b-2 border-t-2 p-2"
        >
          PVZ
        </Link>

        <Link href="collections">
          <div className="w-12 h-12 bg-gray-300 rounded-full mt-2 mb-2 hover:border-white hover:border-2">
            <img
              src="/user-1.png"
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </Link>

        <Link href={"/"} className="p-2 rounded hover:bg-slate-400">
          <Home />
        </Link>
        <Link href={"/collections"} className="p-2 rounded hover:bg-slate-400">
          <Layers />
        </Link>
        <Link href={"/favorites"} className="p-2 rounded hover:bg-slate-400">
          <Heart />
        </Link>
        <Link href={"/message"} className="p-2 rounded hover:bg-slate-400">
          <MessageCircleMore />
        </Link>

        <Link href={"/movies"} className="p-2 rounded hover:bg-slate-400">
          <Clapperboard />
        </Link>
        <Link href={"/tv"} className="p-2 rounded hover:bg-slate-400">
          <Tv />
        </Link>
        <Link href={"/watchlist"} className="p-2 rounded hover:bg-slate-400">
          <ScrollText />
        </Link>

        <Link href={"/genre"} className="p-2 rounded hover:bg-slate-400">
          <Hash />
        </Link>

        <div className="flex flex-col gap-4 mt-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="p-2 rounded hover:bg-slate-400 text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              href={"/login"}
              className="p-2 rounded hover:bg-slate-400 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
