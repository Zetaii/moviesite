import React, { useState } from "react"
import { Edit, Trash } from "lucide-react"
import Link from "next/link"
import MoviePoster from "./MoviePoster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db, auth } from "../utils/firebase"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"

interface Movie {
  id: string
  poster: string
  backdrop: string
}

interface CollectionCardProps {
  collection: {
    id: string
    title: string
    description: string
  }
  movies: Movie[]
  onCollectionUpdate: () => void
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  movies,
  onCollectionUpdate,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(collection.title)
  const [newDescription, setNewDescription] = useState(collection.description)

  const backdropUrl = movies[0]?.backdrop
    ? `https://image.tmdb.org/t/p/w500${movies[0].backdrop}`
    : ""

  const handleDelete = async () => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not signed in")
      return
    }
    try {
      await deleteDoc(doc(db, "users", user.uid, "collections", collection.id))
      console.log("Collection deleted")
      onCollectionUpdate()
    } catch (error) {
      console.error("Error deleting collection:", error)
    }
  }

  const handleUpdate = async () => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not signed in")
      return
    }
    try {
      await updateDoc(
        doc(db, "users", user.uid, "collections", collection.id),
        {
          title: newTitle,
          description: newDescription,
        }
      )
      console.log("Collection updated")
      setIsEditOpen(false)
      onCollectionUpdate()
    } catch (error) {
      console.error("Error updating collection:", error)
    }
  }

  return (
    <div
      className="p-4 sm:p-6 md:p-8 rounded-md shadow relative overflow-hidden"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-md" />

      <div className="absolute top-2 right-2 flex space-x-2 z-20">
        <Edit
          className="text-white cursor-pointer"
          onClick={() => setIsEditOpen(true)}
        />
        <Trash className="text-white cursor-pointer" onClick={handleDelete} />
      </div>

      <Link href={`/collections/${collection.id}`}>
        <h2 className="text-lg sm:text-xl font-semibold cursor-pointer text-white relative z-10">
          {collection.title}
        </h2>
      </Link>
      <p className="text-gray-300 text-sm sm:text-base relative z-10">
        {collection.description}
      </p>

      <div className="mt-2 flex justify-center items-center rounded-md relative z-10 space-x-2">
        {movies.slice(0, 3).map((movie, index) => (
          <MoviePoster key={movie.id} movie={movie} index={index} />
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update the title and description of your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Description"
            />
          </div>
          <DialogFooter>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white p-2 rounded"
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CollectionCard
