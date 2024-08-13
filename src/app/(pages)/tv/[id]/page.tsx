"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

interface TVDetails {
  id: number
  name: string
  overview: string
  backdrop_path: string
  vote_average: number
}

interface TVCredits {
  crew: { job: string; name: string }[]
  cast: { name: string }[]
}

const TVDetailsPage: React.FC = () => {
  const { id } = useParams()
  const [show, setShow] = useState<TVDetails | null>(null)
  const [credits, setCredits] = useState<TVCredits | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        if (id) {
          const [showResponse, creditsResponse] = await Promise.all([
            axios.get<TVDetails>(
              `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            ),
            axios.get<TVCredits>(
              `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            ),
          ])
          setShow(showResponse.data)
          setCredits(creditsResponse.data)
        }
      } catch (err) {
        setError("Failed to fetch TV show details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTVDetails()
  }, [id])

  if (loading) {
    return <div className="text-center text-2xl mt-10">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center text-2xl mt-10 text-red-500">{error}</div>
    )
  }

  if (!show) {
    return <div className="text-center text-2xl mt-10">TV show not found.</div>
  }

  const directors = credits?.crew
    .filter((member) => member.job === "Director")
    .map((member) => member.name)
    .join(", ")
  const writers = credits?.crew
    .filter((member) => member.job === "Writer")
    .map((member) => member.name)
    .join(", ")
  const stars = credits?.cast
    .slice(0, 3)
    .map((member) => member.name)
    .join(", ")

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="h-[500px] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${show.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{show.name}</h1>
        </div>
      </div>
      <section className="flex items-start relative z-10 bg-gray-900 p-6 rounded-lg shadow-lg -mt-28">
        <img
          src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`}
          alt={show.name}
          className="w-48 h-72 rounded-lg shadow-md"
        />
        <div className="px-6">
          <h1 className="text-3xl font-bold text-white mb-4">{show.name}</h1>
          <p className="text-gray-300 mb-4">{show.overview}</p>
          <p className="text-yellow-400 font-semibold mb-4">
            Rating: {show.vote_average.toFixed(1)}
          </p>
          <p className="text-gray-400 mb-2">
            <strong>Director:</strong> {directors || "N/A"}
          </p>
          <p className="text-gray-400 mb-2">
            <strong>Writers:</strong> {writers || "N/A"}
          </p>
          <p className="text-gray-400">
            <strong>Stars:</strong> {stars || "N/A"}
          </p>
        </div>
      </section>
    </div>
  )
}

export default TVDetailsPage
