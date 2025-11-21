import { useEffect, useState } from "react";
import { getMoviesCached } from "../services/movieService";
import { Link } from "react-router-dom";

export default function SeriesPage() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const all = await getMoviesCached();
    setSeries(all.filter((m) => m.category === "serial"));
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Seriallar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {series.map((s) => (
          <Link key={s.id} to={`/movie/${s.id}`}>
            <img src={s.poster_url} className="rounded-xl w-full h-52 object-cover" />
            <p className="mt-1 text-gray-300">{s.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
