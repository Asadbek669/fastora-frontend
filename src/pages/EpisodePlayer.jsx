import { useEffect, useRef } from "react";

export default function EpisodePlayer({ episode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/player/playerjs.min.js";
    script.async = true;

    script.onload = () => {
      new window.Playerjs({
        id: "episode_player",
        file: episode?.video_url,
      });
    };

    document.body.appendChild(script);

    // FULLSCREEN → LANDSCAPE
    function handleFullscreen() {
      const isFull = !!document.fullscreenElement;

      if (isFull) {
        // landscape on enter fullscreen
        if (screen.orientation?.lock) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        // unlock on exit fullscreen
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
  }, [episode]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-black aspect-video rounded-md overflow-hidden"
    >
      <div id="episode_player" className="w-full h-full"></div>
    </div>
  );
}
