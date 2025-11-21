import { useEffect, useState } from "react";
import { getMoviesCached } from "../services/movieService";
import { Link } from "react-router-dom";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const all = await getMoviesCached();
    setMovies(all.filter((m) => m.category === "kino"));
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Kinolar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {movies.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`}>
            <img src={m.poster_url} className="rounded-xl w-full h-52 object-cover" />
            <p className="mt-1 text-gray-300">{m.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
