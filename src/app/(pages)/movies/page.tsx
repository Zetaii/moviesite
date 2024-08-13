"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Star } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  genre_ids: number[]
}

interface Genre {
  id: number
  name: string
}

interface MovieResponse {
  results: Movie[]
}

const MoviePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [movieResponse, genreResponse] = await Promise.all([
          axios.get<MovieResponse>(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
          ),
          axios.get<{ genres: Genre[] }>(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
          ),
        ])
        setMovies(movieResponse.data.results)
        setGenres(genreResponse.data.genres)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching movies:", error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(", ")
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Popular Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={movie.id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2 truncate">
                  {movie.title}
                </h2>
                <div className="flex items-center">
                  <Star strokeWidth={0} className=" fill-yellow-200 mr-1" />
                  <p className="text-sm text-gray-400">
                    Rating: {movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Release Date:{" "}
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Genres: {getGenreNames(movie.genre_ids)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MoviePage
