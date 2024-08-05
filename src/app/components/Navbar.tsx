"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import axios from "axios"

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  const handleSearchChange = async (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(true)

    if (value) {
      try {
        const response = await axios.get(
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

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
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
    <div className="bg-slate-700 p-6">
      <div className="flex items-center justify-between">
        <div className="gap-6 flex items-center text-white">
          <Link href="/" className="text-2xl font-semibold">
            PvzMovies
          </Link>

          <Link href={"/movies"} className="p-2 rounded hover:bg-slate-400">
            Movies
          </Link>
          <Link href={"/tv"} className="p-2 rounded hover:bg-slate-400">
            TV
          </Link>
        </div>
        <div
          className="relative flex items-center border-b-[1.5px] border-white p-1 flex-[0.5]"
          ref={searchRef}
        >
          <input
            type="text"
            className="bg-transparent outline-0 w-full pl-10 pr-4 py-1 text-white"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
          />
          <img
            src="/search.png"
            alt="search"
            className="absolute left-2 w-6 h-6"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bg-slate-800 shadow-lg mt-1 w-96 overflow-y-auto z-10 top-full left-0 border border-gray-700">
              {suggestions.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
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
      </div>
    </div>
  )
}

export default Navbar
