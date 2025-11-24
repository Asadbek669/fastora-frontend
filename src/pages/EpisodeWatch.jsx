import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EpisodePlayer from "./EpisodePlayer";

export default function EpisodeWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    loadEpisode();
  }, [id]);

  function loadEpisode() {
    try {
      const rawIndex = localStorage.getItem("episodes_index");
      if (rawIndex) {
        const index = JSON.parse(rawIndex);
        const movieId = index[String(id)];
        if (movieId) {
          const key = "episodes_for_movie_" + movieId;
          const raw = localStorage.getItem(key);
          if (raw) {
            const eps = JSON.parse(raw);
            const found = eps.find((e) => String(e.id) === String(id));
            if (found) {
              setEpisode(found);
              return;
            }
          }
        }
      }

      // fallback search
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("episodes_for_movie_")) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const eps = JSON.parse(raw);
          const found = eps.find((e) => String(e.id) === String(id));
          if (found) {
            setEpisode(found);
            return;
          }
        }
      }

      setEpisode(null);
    } catch {
      setEpisode(null);
    }
  }

  if (!episode)
    return <div className="text-center text-gray-400 mt-10">Qism topilmadi...</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      
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
      <EpisodePlayer episode={episode} />

      <div className="px-4 py-2">
        <h1 className="text-xl font-bold text-white leading-tight">
          {episode.episode_number}- qism
        </h1>
      </div>
    </div>
  );
}
