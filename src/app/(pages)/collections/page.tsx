"use client"
import React, { useState, useEffect } from "react"
import { db, auth } from "../../utils/firebase"
import {
  collection as firestoreCollection,
  addDoc,
  getDocs,
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import CollectionForm from "@/app/components/CollectionForm"
import CollectionCard from "@/app/components/CollectionCard"

interface MovieCollection {
  id: string
  title: string
  description: string
}

interface Movie {
  id: string
  poster: string
  backdrop: string
}

const MovieCollectionsPage: React.FC = () => {
  const [movieCollections, setMovieCollections] = useState<MovieCollection[]>(
    []
  )
  const [movies, setMovies] = useState<{ [key: string]: Movie[] }>({})
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMovieCollections(user.uid)
      } else {
        console.error("User not signed in")
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchMovieCollections = async (uid: string) => {
    try {
      const collectionRef = firestoreCollection(db, "users", uid, "collections")
      const querySnapshot = await getDocs(collectionRef)
      const userMovieCollections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MovieCollection[]
      setMovieCollections(userMovieCollections)

      userMovieCollections.forEach(async (collection) => {
        const moviesRef = firestoreCollection(
          db,
          "users",
          uid,
          "collections",
          collection.id,
          "movies"
        )
        const moviesSnapshot = await getDocs(moviesRef)
        const moviesList = moviesSnapshot.docs.map((doc) => ({
          id: doc.id,
          poster: doc.data().poster,
          backdrop: doc.data().backdrop,
        })) as Movie[]
        setMovies((prevMovies) => ({
          ...prevMovies,
          [collection.id]: moviesList,
        }))
      })
    } catch (error) {
      console.error("Error fetching movie collections:", error)
    }
  }

  const handleSave = async () => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not signed in")
      return
    }

    const newCollection: Omit<MovieCollection, "id"> = { title, description }

    try {
      const collectionRef = firestoreCollection(
        db,
        "users",
        user.uid,
        "collections"
      )
      await addDoc(collectionRef, newCollection)
      fetchMovieCollections(user.uid)
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("Error saving movie collection:", error)
    }
  }

  const refreshCollections = () => {
    const user = auth.currentUser
    if (user) {
      fetchMovieCollections(user.uid)
    }
  }

  return (
    <div className="h-screen mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Movie Collections</h1>

      <CollectionForm
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        handleSave={handleSave}
      />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movieCollections.length > 0 ? (
          movieCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              movies={movies[collection.id] || []}
              onCollectionUpdate={refreshCollections}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-8">
            No movie collections available. Start a new collection to see it
            here.
          </p>
        )}
      </div>
    </div>
  )
}

export default MovieCollectionsPage
