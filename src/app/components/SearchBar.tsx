"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

interface Movie {
  id: number
  title: string
  poster_path: string
}

interface SearchResponse {
  results: Movie[]
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(true)

    if (value) {
      try {
        const response = await axios.get<SearchResponse>(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${value}`
        )
        setSuggestions(response.data.results.slice(0, 5))
      } catch (error) {
        console.error("Error fetching search results:", error)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className="relative flex items-center bg-slate-900 border-slate-100 border-2 m-1 w-full max-w-[100rem] rounded-md mx-auto px-4"
      ref={searchRef}
    >
      <input
        type="text"
        className="bg-transparent outline-0 w-full pl-12 pr-4 py-1 text-white "
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)}
      />
      <img src="/search.png" alt="search" className="absolute left-5 w-8 h-8" />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bg-slate-800 shadow-lg mt-1 w-full overflow-y-auto z-10 top-full left-0 border border-gray-700">
          {suggestions.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="flex items-center text-white p-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-24 h-24 mr-2 border-white border-2 rounded"
                />
                <span>{movie.title}</span>
              </div>
            </Link>
          ))}
          <Link
            href={`/search?query=${searchTerm}`}
            className="flex items-center justify-center bg-slate-400 text-center p-2"
          >
            More Results
          </Link>
        </div>
      )}
    </div>
  )
}

export default SearchBar
