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
import axios from "axios"

interface Movie {
  id: number
  title: string
  poster_path: string
}

interface MovieResponse {
  results: Movie[]
}

const Popular: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([])

  React.useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1&region=US`
        )
        setMovies(response.data.results.slice(0, 10))
      } catch (error) {
        console.error("Error fetching popular movies:", error)
      }
    }

    fetchPopularMovies()
  }, [])

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
                  <Card className="h-[40vh]">
                    <CardContent className="flex flex-col items-center justify-between p-2 h-full">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-[32vh] object-cover rounded-lg"
                      />
                      <span className="text-sm font-semibold text-center mt-2 line-clamp-2">
                        {movie.title}
                      </span>
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
