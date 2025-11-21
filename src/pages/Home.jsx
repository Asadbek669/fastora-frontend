import { useEffect, useState } from "react";
import StorySlider from "../components/StorySlider";
import HeroSlider from "../components/HeroSlider";
import MovieRow from "../components/MovieRow";
import { getMoviesCached } from "../services/movieService";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromCache();
  }, []);

  async function loadFromCache() {
    const all = await getMoviesCached();

    setMovies(all.filter((m) => m.category === "kino"));
    setSeries(all.filter((m) => m.category === "serial"));
    setCartoons(all.filter((m) => m.category === "multfilm"));

    setLoading(false);
  }

  if (loading) return <div className="p-4 text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="p-4">
      <StorySlider />
      <HeroSlider />

      <MovieRow title="Kinolar" movies={movies.slice(0, 10)} link="/movies" />
      <MovieRow title="Seriallar" movies={series.slice(0, 10)} link="/series" />
      <MovieRow title="Multfilmlar" movies={cartoons.slice(0, 10)} link="/cartoons" />
    </div>
  );
}
