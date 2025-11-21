import { useEffect, useState } from "react";
import { getMoviesCached } from "../services/movieService";
import { Link } from "react-router-dom";

export default function CartoonsPage() {
  const [cartoons, setCartoons] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const all = await getMoviesCached(); // CACHING ISHLATILDI
    setCartoons(all.filter(m => m.category === "multfilm"));
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Multfilmlar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cartoons.map(c => (
          <Link key={c.id} to={`/movie/${c.id}`}>
            <img
              src={c.poster_url}
              className="rounded-xl w-full h-52 object-cover"
            />
            <p className="mt-1 text-gray-300">{c.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
