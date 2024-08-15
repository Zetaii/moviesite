"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Movie {
  id: number
  title: string
  backdrop_path: string
  poster_path: string
  overview: string
}

interface MovieResponse {
  results: Movie[]
}

const TopMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        )
        setMovies(response.data.results.slice(0, 10))
      } catch (error) {
        console.error("Error fetching top movies:", error)
      }
    }

    fetchTopMovies()
  }, [])

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="relative w-full max-w-screen-xl">
        <Carousel>
          <CarouselPrevious className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-75 p-3 rounded-full hover:bg-opacity-100 transition duration-300" />
          <CarouselContent className="h-[70vh] md:h-[80vh] lg:h-[90vh]">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0, 0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-screen-lg space-y-6 md:space-y-0 md:space-x-8 px-4 md:px-8 lg:px-16 py-8">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-48 md:w-64 lg:w-80 h-auto rounded-lg border-white/50 border-2 shadow-lg"
                  />
                  <div className="text-center md:text-left max-w-md">
                    <h4 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
                      {movie.title}
                    </h4>
                    <p className="text-white text-sm md:text-base lg:text-lg mt-2">
                      {movie.overview}
                    </p>
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start mt-6 space-y-4 md:space-y-0 md:space-x-4">
                      <Link href={`/movies/${movie.id}`}>
                        <button className="flex items-center bg-cyan-800 hover:bg-cyan-700 px-4 py-2 rounded-md text-white transition duration-300">
                          <img
                            src="/playIcon.png"
                            className="w-8 h-8 mr-2"
                            alt="Play Icon"
                          />
                          More Info
                        </button>
                      </Link>
                      <button className="flex items-center bg-red-900 hover:bg-red-800 px-4 py-2 rounded-md text-white transition duration-300">
                        Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-75 p-3 rounded-full hover:bg-opacity-100 transition duration-300" />
        </Carousel>
      </div>
    </div>
  )
}

export default TopMovies
