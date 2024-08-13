import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import React from "react"
import Autoplay from "embla-carousel-autoplay"
import TopMovies from "./TopMovies"
import Trending from "./Trending"
import TopTV from "./TopTV"
import Popular from "./Popular"
import Theater from "./Theater"

const Hero = () => {
  return (
    <div className="w-[95.8vw] h-full bg-sky-950 flex flex-col">
      <TopMovies />
      <Theater />
      <TopTV />
      <Popular />

      <div className="flex justify-center mt-4 mb-12">
        <Link href="/movies">
          <button className="bg-transparent border-slate-200 border-2 text-white px-6 py-2 rounded hover:bg-blue-700">
            See More
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
