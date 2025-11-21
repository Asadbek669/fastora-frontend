import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Comments from "./pages/Comments";
import Watch from "./pages/Watch";
import Search from "./pages/Search";


// 🔥 Yangi sahifalar (kategoriya bo‘limlari)
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import CartoonsPage from "./pages/CartoonsPage";

// 🔥 Serial qism ko‘rish sahifasi
import EpisodeWatch from "./pages/EpisodeWatch";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">

        <TopBar />

        <Routes>
          {/* 🏠 Asosiy sahifa */}
          <Route path="/" element={<Home />} />
		  
		  <Route path="/search" element={<Search />} />


          {/* 🎬 Kino/Serial haqida sahifa */}
          <Route path="/movie/:id" element={<MovieDetails />} />

          {/* 💬 Comments */}
          <Route path="/comments/:id" element={<Comments />} />

          {/* ▶ Kino videoni ko‘rish */}
          <Route path="/watch/:id" element={<Watch />} />

          {/* 📺 Serial epizod videoni ko‘rish */}
          <Route path="/episode/:id" element={<EpisodeWatch />} />

          {/* 🔥 Kategoriya sahifalari */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/cartoons" element={<CartoonsPage />} />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
