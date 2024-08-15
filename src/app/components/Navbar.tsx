"use client"
import React, { useEffect, useState } from "react"
import {
  Clapperboard,
  Hash,
  Heart,
  Home,
  Layers,
  MessageCircleMore,
  ScrollText,
  Tv,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { auth } from "../utils/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

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

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="sticky top-0 h-screen bg-slate-800 text-center z-50 shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <button
          onClick={toggleNavbar}
          className="text-white p-2 focus:outline-none hover:bg-slate-600 rounded"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-xl font-bold text-white">
          PVZ
        </Link>
      </div>
      <div className="flex flex-col gap-4 text-white items-center mt-4">
        <Link href="collections">
          <div className="w-14 h-14 bg-gray-500 rounded-full mt-2 mb-2 hover:border-white hover:border-2 transition-all duration-300">
            <img
              src="/user-1.png"
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </Link>

        <NavItem
          href="/"
          icon={<Home className="w-6 h-6" />}
          label="Home"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/collections"
          icon={<Layers className="w-6 h-6" />}
          label="Collections"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/favorites"
          icon={<Heart className="w-6 h-6" />}
          label="Favorites"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/message"
          icon={<MessageCircleMore className="w-6 h-6" />}
          label="Message"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/movies"
          icon={<Clapperboard className="w-6 h-6" />}
          label="Movies"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/tv"
          icon={<Tv className="w-6 h-6" />}
          label="TV"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/watchlist"
          icon={<ScrollText className="w-6 h-6" />}
          label="Watchlist"
          isCollapsed={isCollapsed}
        />
        <NavItem
          href="/genre"
          icon={<Hash className="w-6 h-6" />}
          label="Genre"
          isCollapsed={isCollapsed}
        />

        <div className="flex flex-col gap-4 mt-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="p-2 rounded hover:bg-slate-600 text-white transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="p-2 rounded hover:bg-slate-600 text-white transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isCollapsed,
}) => (
  <Link
    href={href}
    className={`flex ${
      isCollapsed ? "w-14 h-14 justify-center" : "w-48 justify-start"
    } p-2 rounded hover:bg-slate-600 items-center transition-all duration-300`}
  >
    {icon}
    {!isCollapsed && <span className="ml-4">{label}</span>}
  </Link>
)

export default Navbar
