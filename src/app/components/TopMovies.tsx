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
    <div>
      <div className="w-[93vw]">
        <Carousel>
          <CarouselPrevious />
          <CarouselContent className="h-[75vh]">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0, 1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="h-screen flex">
                  <div className="absolute top-[200px] justify-evenly items-center w-[80vw] flex">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-[300px] h-full rounded-lg border-white/45 border-2"
                    />
                    <div className="items-center flex flex-col">
                      <h4 className="text-white text-2xl">{movie.title}</h4>
                      <p className="text-white text-lg mt-2">
                        {movie.overview}
                      </p>
                      <div className="flex items-center justify-end text-lg mt-6">
                        <div className="bg-cyan-800 rounded-md">
                          <Link href={`/movie/${movie.id}`}>
                            <button className="flex items-center hover:text-cyan-200 px-2 justify-center">
                              <img
                                src="/playIcon.png"
                                className="w-12 h-12"
                                alt="Play Icon"
                              />
                              More Info
                            </button>
                          </Link>
                        </div>
                        <div className="ml-12">
                          <button className="flex items-center hover:text-cyan-200 bg-red-900 p-2 rounded w-40 justify-center">
                            Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default TopMovies
