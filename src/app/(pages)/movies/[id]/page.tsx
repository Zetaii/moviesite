"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CrewMember {
  job: string
  name: string
}

interface CastMember {
  name: string
  profile_path?: string
  character?: string
}

interface Video {
  key: string
  name: string
  site: string
  type: string
}

interface Backdrop {
  file_path: string
}

interface MovieDetails {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path?: string
  vote_average: number
}

interface MovieCredits {
  crew: CrewMember[]
  cast: CastMember[]
}

interface MovieVideos {
  results: Video[]
}

interface MovieImages {
  backdrops: Backdrop[]
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams()
  const [film, setFilm] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<MovieCredits | null>(null)
  const [videos, setVideos] = useState<MovieVideos | null>(null)
  const [images, setImages] = useState<MovieImages | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (id) {
          const [
            filmResponse,
            creditsResponse,
            videosResponse,
            imagesResponse,
          ] = await Promise.all([
            axios.get<MovieDetails>(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            ),
            axios.get<MovieCredits>(
              `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            ),
            axios.get<MovieVideos>(
              `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            ),
            axios.get<MovieImages>(
              `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            ),
          ])
          setFilm(filmResponse.data)
          setCredits(creditsResponse.data)
          setVideos(videosResponse.data)
          setImages(imagesResponse.data)
        }
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) {
    return <div className="text-center text-2xl mt-10">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center text-2xl mt-10 text-red-500">{error}</div>
    )
  }

  if (!film) {
    return <div className="text-center text-2xl mt-10">Movie not found.</div>
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
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${film.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{film.title}</h1>
        </div>
      </div>
      <section className="flex items-start relative z-10 bg-gray-900 p-6 rounded-lg shadow-lg -mt-28">
        {film.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
            alt={film.title}
            className="w-48 h-72 rounded-lg shadow-md"
          />
        )}
        <div className="px-6 relative flex-1">
          <h1 className="text-3xl font-bold text-white mb-4">{film.title}</h1>
          <p className="text-gray-300 mb-4">{film.overview}</p>
          <p className="text-yellow-400 font-semibold mb-4">
            Rating: {film.vote_average.toFixed(1)}
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

          <button className="absolute bottom-0 right-0 mb-4 mr-4 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
            Add To Watchlist
          </button>
        </div>
      </section>

      {/* Videos Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Videos</h2>
        <div className="flex space-x-4 overflow-x-auto items-center">
          {videos?.results
            .slice(0, 2)
            .map(
              (video) =>
                video.site === "YouTube" && (
                  <iframe
                    key={video.key}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                )
            )}
          <Link href={`/movies/${id}/videos`} className="ml-auto flex">
            <span className="text-blue-600 hover:underline cursor-pointer mr-2">
              See More Videos
            </span>
            <ArrowRight className="text-blue-700" />
          </Link>
        </div>
      </section>

      {/* Photos Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Photos</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {images?.backdrops.slice(0, 5).map((image, index) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
              alt={`Backdrop ${index + 1}`}
              className="w-64 h-36 object-cover rounded-lg"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Link href={`/movies/${id}/photos`}>
            <span className="text-blue-600 hover:underline cursor-pointer">
              See More Photos
            </span>
          </Link>
        </div>
      </section>

      {/* Cast Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Casts</h2>
        <div className="grid grid-cols-2 gap-4">
          {credits?.cast.map((actor, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg"
            >
              {actor.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="w-24 h-24 object-cover rounded-full"
                />
              )}
              <div>
                <p className="text-white font-bold">{actor.name}</p>
                {actor.character && (
                  <p className="text-gray-400">as {actor.character}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MovieDetailsPage
