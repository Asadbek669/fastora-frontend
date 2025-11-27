import { useEffect, useRef, useState } from "react";

export default function Player({ movie }) {
  const containerRef = useRef(null);
  const [blocked, setBlocked] = useState(false); // 403 bo'lsa true bo'ladi

  useEffect(() => {
    async function init() {
      const url = movie?.video_url;

      // 1. VIDEO 403 BERAYOTGANINI TEKSHIRISH
      const allowed = await checkVideo(url);

      if (!allowed) {
        console.warn("403 topildi → PlayerJS ochilmaydi, tugma ko'rsatiladi");
        setBlocked(true);
        return;
      }

      // 2. PlayerJS yuklash
      loadPlayer(url);
    }

    init();

    // PLAYERJS yuklovchi funksiya
    function loadPlayer(url) {
      const script = document.createElement("script");
      script.src = "/player/playerjs.min.js";
      script.async = true;

      script.onload = () => {
        new window.Playerjs({
          id: "movie_player",
          file: url,
          poster: movie?.poster || "",
        });
      };

      document.body.appendChild(script);
    }

    // GET + RANGE orqali 403 ni aniqlash (100% aniq)
    async function checkVideo(url) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-1" }, // faqat 1 bayt
        });

        if (res.status === 206 || res.status === 200) return true;
        if (res.status === 403) return false;

        return true;
      } catch {
        return false;
      }
    }
  }, [movie]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-black aspect-video flex items-center justify-center"
    >
      {/* Agar 403 bo'lsa — tugma chiqadi */}
      {blocked ? (
        <div className="text-center p-4">
          <p className="text-red-400 text-lg mb-3">
            Video bu sahifada ochilmaydi (403).
          </p>

          <a
            href={movie.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-lg transition"
          >
            ▶ To‘g‘ridan-to‘g‘ri ochish
          </a>
        </div>
      ) : (
        <div id="movie_player" className="w-full h-full"></div>
      )}
    </div>
  );
}
