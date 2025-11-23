import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Player from "./Player";
import { getMovie } from "../services/movieService";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    loadMovie();
  }, [id]);

  async function loadMovie() {
    try {
      const data = await getMovie(id);
      setMovie(data);
    } catch (err) {
      console.log("Xatolik:", err);
    }
  }

  if (!movie)
    return (
      <p className="text-center text-gray-400 mt-10">Ma’lumot yuklanmoqda...</p>
    );

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Back Button */}
      <div className="p-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg hover:opacity-90 active:scale-95 transition-transform"
          aria-label="Orqaga"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-6 h-6"
            style={{ color: 'white' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span>Orqaga</span>
        </button>
      </div>

      {/* VIDEO PLAYERJS */}
      <Player movie={movie} />

      {/* Movie Title */}
      <div className="p-4 mt-4">
        <h1 className="text-xl font-bold">{movie.title}</h1>
      </div>
    </div>
  );
}
