import { useEffect } from "react";

export default function EpisodePlayer({ episode }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/player/playerjs.min.js";
    script.onload = () => {
      new window.Playerjs({
        id: "episode_player",
        file: episode?.video_url,
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [episode]);

  return (
    <div className="bg-black w-full h-[350px]">
      <div id="episode_player" className="w-full h-full"></div>
    </div>
  );
}
