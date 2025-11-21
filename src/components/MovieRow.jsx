import { Link } from "react-router-dom";

export default function MovieRow({ title, movies, link }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>

        {/* Barchasini ko‘rish */}
        <Link
          to={link}
          className="text-sm text-red-500 hover:text-red-400 font-medium"
        >
          Barchasini ko‘rish →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="w-32 flex-shrink-0"
          >
            <img
              src={movie.poster_url}
              className="rounded-lg w-full h-44 object-cover"
            />
            <p className="mt-1 text-sm text-gray-300">{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
