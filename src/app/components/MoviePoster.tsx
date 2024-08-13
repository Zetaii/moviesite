import React from "react"

interface MoviePosterProps {
  movie: {
    id: string
    poster: string
  }
  index: number
}

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, index }) => (
  <img
    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
    alt="Movie Poster"
    className={`object-cover rounded ${
      index === 1
        ? "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mt-[-2px] -mx-2 z-10"
        : "w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60"
    }`}
  />
)

export default MoviePoster
