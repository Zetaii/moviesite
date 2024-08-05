"use client"
import React, { useState } from "react"

const page = () => {
  const [film, setFilm] = useState({
    id: 0,
    title: "Fake Movie Title",
    description: "Fake Movie Description",
    coverPath: "",
    genreIds: [],
    mediaType: "movie",
    posterPath: "",
    seasons: [],
  })

  return (
    <>
      <div className="h-[300px] left-0 right-0 top-0">
        <img
          src="/movie1.png"
          alt="Movie 1"
          className="w-full h-full object-cover"
        />
      </div>
      <section className="-mt-[150px] flex items-start relative z-10">
        <img src="/movie1.png" alt="Movie 1" className="w-48 h-72" />
        <div className="px-3">
          <p className="text-xl line-clamp-1">{film.title} </p>
        </div>
      </section>
    </>
  )
}

export default page
