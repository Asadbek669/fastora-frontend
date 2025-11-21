import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../assets/search.svg";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const doSearch = () => {
    if (!query.trim()) return;

    fetch(`https://fastora-backend.onrender.com/movies/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-4 text-white">

      {/* INPUT + SEARCH BUTTON */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Film yoki serial qidiring..."
          className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}

          // ENTER BOSILGANDA qidirish
          onKeyDown={(e) => {
            if (e.key === "Enter") doSearch();
          }}
        />

        {/* SEARCH ICON BUTTON */}
        <button
          onClick={doSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 active:scale-95"
        >
          <img src={SearchIcon} className="w-6 h-6" />
        </button>
      </div>

      {/* RESULTS PREMIUM GRID */}
      <div className="grid grid-cols-2 gap-4">
        {results.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/movie/${m.id}`)}
            className="
              cursor-pointer 
              bg-white/5 
              rounded-xl 
              overflow-hidden 
              border border-white/10 
              backdrop-blur-xl
              hover:shadow-xl 
              hover:scale-[1.02] 
              transition-all 
              active:scale-95
            "
          >
            {/* POSTER */}
            <div className="w-full h-40 bg-black/20 overflow-hidden">
              <img
                src={m.poster_url}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="p-3">
              <div className="text-sm font-bold leading-tight mb-1">
                {m.title}
              </div>

              <div className="flex gap-2 items-center text-xs opacity-80">
                <span className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">
                  {m.category || "Noma'lum"}
                </span>

                <span>{m.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NO RESULT */}
      {query && results.length === 0 && (
        <div className="text-center opacity-50 mt-5">Hech narsa topilmadi</div>
      )}

    </div>
  );
}
