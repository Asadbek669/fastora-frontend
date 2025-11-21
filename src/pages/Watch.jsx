import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Player from "./Player";
import { getMovie } from "../services/movieService";

export default function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    loadMovie();
  }, [id]);

  async function loadMovie() {
    try {
      const data = await getMovie(id);
      setMovie(data);
    } catch (err) {
      console.log("Xatolik:", err);
    }
  }

  if (!movie)
    return (
      <p className="text-center text-gray-400 mt-10">Ma’lumot yuklanmoqda...</p>
    );

  return (
    <div className="pb-20">
      <Player movie={movie} />
    </div>
  );
}
