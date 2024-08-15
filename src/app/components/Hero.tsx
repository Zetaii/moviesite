"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { auth, db } from "../utils/firebase"
import { collection, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import TopMovies from "./TopMovies"
import Trending from "./Trending"
import TopTV from "./TopTV"
import Popular from "./Popular"
import Theater from "./Theater"
import SearchBar from "./SearchBar" // Import the SearchBar component

const Hero: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([])

  useEffect(() => {
    const fetchCollections = async (userId: string) => {
      try {
        const collectionRef = collection(db, "users", userId, "collections")
        const querySnapshot = await getDocs(collectionRef)
        const userCollections = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCollections(userCollections)
      } catch (error) {
        console.error("Error fetching collections:", error)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCollections(user.uid)
      } else {
        setCollections([]) // Clear collections if user logs out
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full h-full bg-sky-950 flex flex-col items-center px-4 py-8 space-y-8">
      <SearchBar />
      <TopMovies />
      <Theater />
      <TopTV collections={collections} />
      <Trending collections={collections} />
      <Popular collections={collections} />
      <div className="flex justify-center mt-4 mb-12">
        <Link href="/movies">
          <button className="bg-transparent border-slate-200 border-2 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
            See More
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
