import { useEffect } from "react";

export default function Player({ movie }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/player/playerjs.min.js";
    script.onload = () => {
      new window.Playerjs({
        id: "movie_player",
        file: movie?.video_url,
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [movie]);

  return (
    <div className="bg-black w-full h-[350px]">
      <div id="movie_player" className="w-full h-full"></div>
    </div>
  );
}
