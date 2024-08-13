"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Genre {
  id: number
  name: string
}

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  media_type: "movie" | "tv"
}

const BrowseByGenre: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        )
        setGenres(response.data.genres)
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    if (selectedGenre !== null) {
      const fetchMoviesByGenre = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=${selectedGenre}`
          )

          const moviesWithMediaType = response.data.results.map(
            (movie: any) => ({
              ...movie,
              media_type: "movie",
            })
          )
          setMovies(moviesWithMediaType)
        } catch (error) {
          console.error("Error fetching movies:", error)
        }
      }

      fetchMoviesByGenre()
    }
  }, [selectedGenre])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse By Genre</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            {genre.name}
          </button>
        ))}
      </div>
      {selectedGenre && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Movies in {genres.find((g) => g.id === selectedGenre)?.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-blue-500 shadow-md rounded-lg overflow-hidden flex flex-col w-full max-w-xs"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[30vh] object-fill"
                />
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold text-white">
                    {movie.title}
                  </h3>
                  <p className="text-white">{movie.release_date}</p>
                  <p className="text-white capitalize">{movie.media_type}</p>
                </div>
                <div className="p-4">
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Add to Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseByGenre
