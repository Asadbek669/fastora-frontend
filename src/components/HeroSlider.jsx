import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSlider() {
  const sliderRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("hero_banners");
    if (raw) {
      setBanners(JSON.parse(raw));
    }
  }, []);

  // AUTO SWIPE
  useEffect(() => {
    if (banners.length === 0) return;

    const slider = sliderRef.current;
    let index = 0;

    const interval = setInterval(() => {
      index++;
      if (index >= banners.length) index = 0;

      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div className="mt-4">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x"
      >
        {banners.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/movie/${item.id}`)}
            className="
              relative min-w-[85%] h-52 rounded-xl 
              overflow-hidden shadow-lg flex-shrink-0 snap-start
              cursor-pointer active:scale-95 transition-all
            "
          >
            {/* Rasm */}
            <img
              src={item.backdrop_url || item.poster_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Orqa gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Pastki info */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-xl font-bold drop-shadow">{item.title}</div>

              <div className="flex items-center gap-2 mt-1 text-sm opacity-80">
                {item.category && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-lg">
                    {item.category}
                  </span>
                )}
                {item.imdb && (
                  <span className="px-2 py-0.5 bg-yellow-500/80 rounded-lg text-black font-semibold">
                    IMDb {item.imdb}
                  </span>
                )}
              </div>

              {/* Batafsil tugma */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movie/${item.id}`);
                }}
                className="
                  mt-2 w-full py-2 
                  bg-red-600/90 hover:bg-red-600 
                  rounded-lg text-center font-semibold
                  shadow-lg active:scale-95 transition
                "
              >
                Batafsil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
