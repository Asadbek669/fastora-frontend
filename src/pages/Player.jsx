import { useEffect, useRef } from "react";

export default function Player({ movie }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/player/playerjs.min.js";
    script.async = true;

    script.onload = () => {
      new window.Playerjs({
        id: "movie_player",
        file: movie?.video_url,
        poster: movie?.poster || "",
      });
    };

    document.body.appendChild(script);

    // FULLSCREEN → LANDSCAPE
    function handleFullscreen() {
      const isFull = !!document.fullscreenElement;

      if (isFull) {
        // LOCK LANDSCAPE
        if (screen.orientation?.lock) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        // UNLOCK ON EXIT
        if (screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.body.removeChild(script);
    };
  }, [movie]);

  return (
    <div ref={containerRef} className="w-full bg-black aspect-video">
      <div id="movie_player" className="w-full h-full"></div>
    </div>
  );
}
