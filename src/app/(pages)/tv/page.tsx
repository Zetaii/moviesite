"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface TVShow {
  id: number
  name: string
  poster_path: string
  vote_average: number
}

interface TVResponse {
  results: TVShow[]
}

const TVPage: React.FC = () => {
  const [shows, setShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const response = await axios.get<TVResponse>(
          `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        )
        setShows(response.data.results)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching TV shows:", error)
        setLoading(false)
      }
    }

    fetchTVShows()
  }, [])

  if (loading) {
    return <div className="text-center text-2xl mt-10">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Popular TV Shows</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <Link href={`/tv/${show.id}`} key={show.id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2 truncate">
                  {show.name}
                </h2>
                <p className="text-sm text-gray-400">
                  Rating: {show.vote_average.toFixed(1)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TVPage
