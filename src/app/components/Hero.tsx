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
    <div className="w-[99vw] h-full bg-black flex flex-col items-center justify-center">
      <TopMovies />
      <Theater />

      <TopTV />
      <Popular />
    </div>
  )
}

export default Hero
