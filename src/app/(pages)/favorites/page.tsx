import React from "react"

const MyFavorites = () => {
  // Placeholder data for favorite movies
  const favoriteMovies = [
    {
      id: 1,
      title: "Inception",
      genre: "Action, Sci-Fi",
      posterUrl: "https://via.placeholder.com/150", // Replace with actual poster URL
    },
    {
      id: 2,
      title: "The Godfather",
      genre: "Crime, Drama",
      posterUrl: "https://via.placeholder.com/150",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        My Favorites
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favoriteMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{movie.title}</h2>
              <p className="text-gray-600">{movie.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyFavorites
