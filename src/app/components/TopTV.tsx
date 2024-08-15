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
import { db, auth } from "../utils/firebase"
import { collection, addDoc } from "firebase/firestore"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface TVShow {
  id: number
  name: string
  poster_path: string
  vote_average: number
  first_air_date: string
  genre_ids: number[]
}

interface Genre {
  id: number
  name: string
}

interface TVShowResponse {
  results: TVShow[]
}

interface TopTVProps {
  collections: any[]
}

const TopTV: React.FC<TopTVProps> = ({ collections }) => {
  const [tvShows, setTvShows] = React.useState<TVShow[]>([])
  const [genres, setGenres] = React.useState<Genre[]>([])

  React.useEffect(() => {
    const fetchTrendingTVShows = async () => {
      try {
        const [tvShowResponse, genreResponse] = await Promise.all([
          axios.get<TVShowResponse>(
            `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          axios.get<{ genres: Genre[] }>(
            `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
          ),
        ])
        setTvShows(tvShowResponse.data.results.slice(0, 10))
        setGenres(genreResponse.data.genres)
      } catch (error) {
        console.error("Error fetching trending TV shows:", error)
      }
    }

    fetchTrendingTVShows()
  }, [])

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .join(", ")
  }

  const addToCollection = async (collectionId: string, show: TVShow) => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not signed in")
      return
    }

    const showData = {
      mediaType: "tv",
      title: show.name,
      releaseDate: show.first_air_date,
      genres: getGenreNames(show.genre_ids),
      rating: show.vote_average,
      poster: show.poster_path,
    }

    try {
      const collectionRef = collection(
        db,
        "users",
        user.uid,
        "collections",
        collectionId,
        "tvshows"
      )
      await addDoc(collectionRef, showData)
      console.log("TV Show added to collection")
    } catch (error) {
      console.error("Error adding TV show to collection:", error)
    }
  }

  return (
    <div className="w-full mx-auto mt-12 px-4 border-b-2 border-gray-400">
      <h2 className="text-2xl font-bold mb-4 text-white">Trending TV Shows</h2>
      <div className="relative">
        <Carousel className="w-full relative h-[80vh]">
          <CarouselContent className="-ml-4">
            {tvShows.map((show) => (
              <CarouselItem
                key={show.id}
                className="pl-4 md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card className="bg-transparent border-none h-full overflow-y-auto">
                    <CardContent className="flex flex-col h-full p-0">
                      <Link href={`/tv/${show.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                          alt={show.name}
                          className="w-full h-[49vh] object-cover rounded-t-lg cursor-pointer"
                        />
                      </Link>
                      <div className="bg-blue-500 w-full text-center text-white p-6">
                        <Link href={`/tv/${show.id}`}>
                          <span className="text-sm font-semibold line-clamp-2 cursor-pointer">
                            {show.name}
                          </span>
                        </Link>
                        <div className="flex items-center justify-center">
                          <Star className="mr-1 text-yellow-300 fill-yellow-300" />
                          <p className="text-xs">
                            Rating: {show.vote_average.toFixed(1)}
                          </p>
                        </div>
                        <p className="text-xs">
                          First Air Date:{" "}
                          {new Date(show.first_air_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs">
                          Genres: {getGenreNames(show.genre_ids)}
                        </p>
                      </div>

                      <Accordion
                        type="single"
                        collapsible
                        className="w-full bg-blue-600 rounded-b-xl"
                      >
                        <AccordionItem
                          value="item-1"
                          className="border-0 text-center"
                        >
                          <AccordionTrigger className="border-b-xl justify-center items-center text-white">
                            Add to Collection
                          </AccordionTrigger>
                          <AccordionContent>
                            {collections.map((collection) => (
                              <button
                                key={collection.id}
                                className="w-full bg-gray-200 text-black text-sm py-1 rounded-lg hover:bg-gray-300 mt-1"
                                onClick={() =>
                                  addToCollection(collection.id, show)
                                }
                              >
                                {collection.title}
                              </button>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </div>
  )
}

export default TopTV
