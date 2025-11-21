import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie, addLike, removeLike } from "../services/movieService";
import { Heart, MessageCircle } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadMovie();

    const stored = localStorage.getItem("liked_" + id);
    if (stored === "true") setIsLiked(true);
  }, [id]);

  // Save episodes to localStorage + maintain fast index
  useEffect(() => {
    if (!movie) return;
    if (!movie.episodes || !Array.isArray(movie.episodes)) return;

    try {
      // Save episodes array for this movie
      const key = "episodes_for_movie_" + movie.id;
      localStorage.setItem(key, JSON.stringify(movie.episodes));

      // Update global index: episodeId -> movieId
      const rawIndex = localStorage.getItem("episodes_index");
      const index = rawIndex ? JSON.parse(rawIndex) : {};

      for (const ep of movie.episodes) {
        // ensure id exists
        if (ep && (ep.id !== undefined && ep.id !== null)) {
          index[String(ep.id)] = movie.id;
        }
      }

      localStorage.setItem("episodes_index", JSON.stringify(index));
    } catch (e) {
      // If storage fails (private mode, quota), ignore silently
      console.warn("Failed to store episodes in localStorage:", e);
    }
  }, [movie]);

  async function loadMovie() {
    const data = await getMovie(id);
    setMovie(data);
  }

  async function handleToggleLike() {
    let res;

    if (!isLiked) {
      res = await addLike(movie.id);
      localStorage.setItem("liked_" + movie.id, "true");
      setIsLiked(true);
    } else {
      res = await removeLike(movie.id);
      localStorage.removeItem("liked_" + movie.id);
      setIsLiked(false);
    }

    setMovie({ ...movie, likelar: res.likes });
  }

  if (!movie)
    return (
      <p className="text-center text-gray-400 mt-10">
        Ma’lumot yuklanmoqda...
      </p>
    );

  const isSerial = movie.category === "serial";

  return (
    <div className="text-white min-h-screen bg-[#0a0a0a]">

      {/* BACKDROP */}
      <div className="relative w-full h-[300px]">
        <img
          src={movie.backdrop_url}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a70] to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-4 mt-[-40px]">

        {/* Poster + Title */}
        <div className="flex gap-4 items-start">
          <img
            src={movie.poster_url}
            className="w-32 h-48 object-cover rounded-xl shadow-lg border border-white/10"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-sm mt-1">📅 {movie.year}</p>

            <div className="mt-3 flex flex-col gap-1 text-sm opacity-90">
              <span>🌍 Davlat: {movie.davlat}</span>
              <span>🔊 Til: O‘zbek tilida</span>

              <span className="inline-flex items-center gap-2 bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded-lg w-max mt-1">
                ⭐ IMDb: {movie.imdb}
              </span>

			  <div className="flex items-center gap-4 mt-3">
			  
			    {/* LIKE */}
			    <button
				  onClick={handleToggleLike}
				  className="
				    flex flex-col items-center
				    bg-white/10 border border-white/20 
				    backdrop-blur-md rounded-xl 
				    px-4 py-2 w-20 active:scale-95 transition
				  "
			    >
				  <span className="text-sm font-semibold">
				    {movie.likelar}
				  </span>

				  <Heart
				    className={`
					  w-6 h-6 mt-1 transition-all duration-300
					  ${isLiked ? "text-red-500 fill-red-500 scale-125" : "text-gray-300"}
				  `}
				 />
			    </button>

			    {/* COMMENT */}
			    <button
				  onClick={() => navigate(`/comments/${movie.id}`)}
				  className="
				    flex flex-col items-center
				    bg-white/10 border border-white/20 
				    backdrop-blur-md rounded-xl 
				    px-4 py-2 w-20 active:scale-95 transition
				  "
			    >
				  <span className="text-sm font-semibold">
				  {movie.comments?.length ?? 0}
				  </span>

				  <MessageCircle className="w-6 h-6 mt-1 text-gray-300" />
			    </button>

			  </div>
            </div>
          </div>
        </div>

        {/* WATCH BUTTON (only movies) */}
        {!isSerial && movie.video_url && (
          <button
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="
              w-full mt-6 py-3 bg-red-600 
              rounded-xl text-lg font-bold 
              shadow-lg active:scale-95
            "
          >
            ▶ Tomosha qilish
          </button>
        )}

        {/* EPISODES (only serials) */}
        {isSerial && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">📺 Qismlar</h2>

            <div className="grid grid-cols-3 gap-2">
              {movie.episodes?.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => navigate(`/episode/${ep.id}`)}
                  className="
                    bg-[#1d1d1d] 
                    rounded-lg 
                    border border-white/10
                    active:scale-95 
                    transition

                    h-14 
                    px-2
                    flex items-center justify-center

                    text-xs font-medium
                    text-center
                  "
                >
                  {ep.title ? ep.title : `${ep.episode_number}-qism`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mt-6">
          <h2 className="text-gray-400 mb-1">Film haqida qisqacha</h2>
          <p className="text-gray-300 leading-relaxed">{movie.description}</p>
        </div>

      </div>
    </div>
  );
}
