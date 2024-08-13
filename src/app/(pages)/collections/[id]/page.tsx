"use client"
import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db, auth } from "../../../utils/firebase"
import { collection, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { Edit, Trash } from "lucide-react"

interface Collection {
  id: string
  title: string
  description: string
}

interface Movie {
  id: string
  title: string
  rating: number
  releaseDate: string
  genres: string
  poster: string
}

const CollectionDetailPage: React.FC = () => {
  const [movieCollection, setMovieCollection] = useState<Collection | null>(
    null
  )
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async (userId: string, collectionId: string) => {
      try {
        const docRef = doc(db, "users", userId, "collections", collectionId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Collection, "id">
          setMovieCollection({ id: docSnap.id, ...data })
        } else {
          console.error("No such document!")
        }

        const moviesRef = collection(
          db,
          "users",
          userId,
          "collections",
          collectionId,
          "movies"
        )
        const querySnapshot = await getDocs(moviesRef)
        const moviesList = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Movie, "id">
          return { id: doc.id, ...data }
        })
        setMovies(moviesList)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && typeof id === "string") {
        // Ensure id is a string
        fetchData(user.uid, id)
      }
    })

    return () => unsubscribe()
  }, [id])

  const handleDelete = async (movieId: string) => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not signed in")
      return
    }
    if (typeof id !== "string") {
      console.error("Invalid collection ID")
      return
    }
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "collections", id, "movies", movieId)
      )
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      )
    } catch (error) {
      console.error("Error deleting movie:", error)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {movieCollection?.title}
      </h1>
      <p className="text-gray-600">{movieCollection?.description}</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-600">Rating: {movie.rating}</p>
                <p className="text-gray-600">
                  Release Date: {movie.releaseDate}
                </p>
                <p className="text-gray-600">Genres: {movie.genres}</p>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2 z-20">
                <Trash
                  className="text-gray-600 cursor-pointer"
                  onClick={() => handleDelete(movie.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No items in this collection yet.</p>
        )}
      </div>
    </div>
  )
}

export default CollectionDetailPage
