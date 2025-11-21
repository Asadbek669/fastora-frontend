import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EpisodeWatch() {
  const { id } = useParams(); // episode ID
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    loadEpisode();
  }, [id]);

  function loadEpisode() {
    try {
      // 1) First try fast index: episodes_index -> movieId
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

      // 2) Fallback: iterate all episodes_for_movie_* keys (if index missing)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("episodes_for_movie_")) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          try {
            const eps = JSON.parse(raw);
            if (!Array.isArray(eps)) continue;
            const found = eps.find((e) => String(e.id) === String(id));
            if (found) {
              setEpisode(found);
              return;
            }
          } catch (e) {
            // ignore malformed json
            continue;
          }
        }
      }

      // not found
      setEpisode(null);
    } catch (e) {
      console.warn("Episode lookup error:", e);
      setEpisode(null);
    }
  }

  if (!episode)
    return (
      <div className="text-center text-gray-400 mt-10">
        Qism topilmadi...
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Orqaga */}
      <div className="p-3">
        <button onClick={() => navigate(-1)} className="text-lg">
          ⬅ Orqaga
        </button>
      </div>

      {/* VIDEO */}
      <video
        src={episode.video_url}
        controls
        autoPlay
        className="w-full max-h-[350px] bg-black"
      />

      <div className="p-4">
        <h1 className="text-xl font-bold">
          {episode.episode_number}-qism — {episode.title}
        </h1>
      </div>
    </div>
  );
}
