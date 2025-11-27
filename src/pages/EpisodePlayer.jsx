import { useEffect, useRef, useState } from "react";

export default function EpisodePlayer({ episode }) {
  const containerRef = useRef(null);
  const [blocked, setBlocked] = useState(false); // 403 bo'lsa shu true bo'ladi

  useEffect(() => {
    async function init() {
      const url = episode?.video_url;

      // 1. VIDEO RUXSAT EDI GANMI YO'QMI — TEKSHIRAMIZ
      const allowed = await checkVideo(url);

      if (!allowed) {
        console.warn("403 topildi → Player ishlamaydi, tugma chiqariladi");
        setBlocked(true);
        return;
      }

      // 2. PlayerJS yuklaymiz
      loadPlayer(url);
    }

    init();

    // PlayerJS yuklovchi funksiya
    function loadPlayer(url) {
      const script = document.createElement("script");
      script.src = "/player/playerjs.min.js";
      script.async = true;

      script.onload = () => {
        new window.Playerjs({
          id: "episode_player",
          file: url,
        });
      };

      document.body.appendChild(script);
    }

    // GET + RANGE orqali 403 tekshirish
    async function checkVideo(url) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-1" },
        });

        if (res.status === 206 || res.status === 200) return true;
        if (res.status === 403) return false;

        return true;
      } catch {
        return false;
      }
    }
  }, [episode]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-black aspect-video rounded-md overflow-hidden flex items-center justify-center"
    >
      {/* 🔥 403 BO'LSA — TO'G'RIDA OCHISH TUGMASI CHIQADI */}
      {blocked ? (
        <div className="text-center p-4">
          <p className="text-red-400 mb-3 text-lg">
            Video bu sahifada ochilmaydi (403).
          </p>

          <a
            href={episode.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-lg transition"
          >
            ▶ To‘g‘ridan-to‘g‘ri ochish
          </a>
        </div>
      ) : (
        // PlayerJS joyi
        <div id="episode_player" className="w-full h-full"></div>
      )}
    </div>
  );
}
