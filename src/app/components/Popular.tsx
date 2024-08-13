"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import axios from "axios"
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

const Popular: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [genres, setGenres] = React.useState<Genre[]>([])

  React.useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const [movieResponse, genreResponse] = await Promise.all([
          axios.get<MovieResponse>(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&region=US`
          ),
          axios.get<{ genres: Genre[] }>(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
          ),
        ])
        setMovies(movieResponse.data.results.slice(0, 10))
        setGenres(genreResponse.data.genres)
      } catch (error) {
        console.error("Error fetching popular movies:", error)
      }
    }

    fetchPopularMovies()
  }, [])

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .join(", ")
  }

  return (
    <div className="w-full mx-auto mt-12 px-4 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white">Popular Movies</h2>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="pl-4 md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card className="h-[66vh] bg-transparent border-none">
                    <CardContent className="flex flex-col h-full p-0">
                      <Link href={`/movies/${movie.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-[49vh] object-cover rounded-t-lg cursor-pointer"
                        />
                      </Link>
                      <div className="bg-blue-500 w-full text-center text-white p-6">
                        <Link href={`/movies/${movie.id}`}>
                          <span className="text-sm font-semibold line-clamp-2 cursor-pointer">
                            {movie.title}
                          </span>
                        </Link>
                        <div className="flex items-center justify-center">
                          <Star className="mr-1 text-yellow-300 fill-yellow-300" />
                          <p className="text-xs">
                            Rating: {movie.vote_average.toFixed(1)}
                          </p>
                        </div>
                        <p className="text-xs">
                          Release Date:{" "}
                          {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs">
                          Genres: {getGenreNames(movie.genre_ids)}
                        </p>
                      </div>

                      <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-b-lg hover:bg-blue-700">
                        Add to Collection
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  )
}

export default Popular
