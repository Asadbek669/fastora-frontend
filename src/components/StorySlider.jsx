import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../services/movieService";

/**
 * Professional Fullscreen Story Slider
 *
 * Features:
 * - shows up to 15 stories (latest first)
 * - clicking a story opens fullscreen modal
 * - fullscreen overlay: left/right touch/click zones to navigate
 * - autoplay: 5s per story, pauses on hover/touch
 * - top indicator bar with segments (active = red, passed = red, next = white/gray)
 * - "Batafsil" button pinned bottom on image (full-width clickable)
 * - swipe support (touchstart/touchmove/touchend)
 */

export default function StorySlider() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // index of open story or null
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();

  // touch handling
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const autoplayTimer = useRef(null);

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const movies = await getMovies();

      // sort by newest first if you have a created_at or id
      // assuming higher id = newer. adjust if you have created_at.
      const sorted = movies
        .filter((m) => m.poster_url)
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 15)
        .map((m) => ({
          id: m.id,
          title: m.title,
          image: m.poster_url,
          category: m.category,
          year: m.year,
        }));

      setStories(sorted);
    } catch (err) {
      console.log("Story yuklashda xatolik:", err);
    }
  }

  // autoplay for open modal
  useEffect(() => {
    if (activeIndex === null) {
      clearTimer();
      return;
    }
    if (!isPlaying) return;

    clearTimer();
    autoplayTimer.current = setTimeout(() => {
      goNext();
    }, 5000);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isPlaying]);

  function clearTimer() {
    if (autoplayTimer.current) {
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }

  function openStory(i) {
    setActiveIndex(i);
    setIsPlaying(true);
  }

  function closeStory() {
    setActiveIndex(null);
    setIsPlaying(false);
    clearTimer();
  }

  function goPrev() {
    setActiveIndex((i) => (i > 0 ? i - 1 : i));
    setIsPlaying(true);
  }

  function goNext() {
    setActiveIndex((i) => (i < stories.length - 1 ? i + 1 : null));
    setIsPlaying(true);
  }

  // touch handlers for swipe
  function handleTouchStart(e) {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = touchStartX.current;
    setIsPlaying(false);
    clearTimer();
  }

  function handleTouchMove(e) {
    if (!e.touches || e.touches.length === 0) return;
    touchCurrentX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const dx = touchCurrentX.current - touchStartX.current;
    const threshold = 50; // px
    if (dx > threshold) {
      // swipe right => prev
      goPrev();
    } else if (dx < -threshold) {
      // swipe left => next
      goNext();
    } else {
      // tap -> toggle play/pause or do nothing
      setIsPlaying((p) => !p);
    }
  }

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <>
      {/* small horizontal story list (circular thumbnails) */}
      <div className="w-full mt-4 mb-4">
        <h2 className="text-lg font-semibold mb-2 text-white">Yangi qo‘shilganlar</h2>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
          {stories.map((s, i) => (
            <div
              key={s.id}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
              onClick={() => openStory(i)}
            >
              <div className="w-20 h-20 rounded-full border-2 border-red-600 overflow-hidden shadow-lg hover:scale-105 transform transition">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs mt-1 w-20 text-center truncate text-gray-300">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN STORY MODAL */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          onMouseEnter={() => { setIsPlaying(false); clearTimer(); }}
          onMouseLeave={() => { setIsPlaying(true); }}
        >
          {/* TOP INDICATOR BAR */}
          <div className="w-full p-3 pt-6 z-60">
            <div className="max-w-full mx-auto flex gap-2 items-center px-4">
              <div className="flex-1 flex gap-2 items-center">
                {stories.map((_, idx) => {
                  // style for progress segments
                  const passed = idx < activeIndex;
                  const active = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      className="h-1 rounded-full flex-1 overflow-hidden"
                    >
                      <div
                        style={{
                          width: active ? "100%" : passed ? "100%" : "0%",
                          height: "100%",
                          transition: "width 300ms linear",
                          background: active || passed
                            ? "linear-gradient(90deg,#ff3b30,#ff5a5f)" // qizil gradient
                            : "rgba(255,255,255,0.35)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* top-right close button */}
              <button
                onClick={closeStory}
                className="ml-3 text-white/90 px-3 py-1 rounded-md bg-black/40 hover:bg-black/60"
                aria-label="Yopish"
              >
                Yopish
              </button>
            </div>
          </div>

          {/* IMAGE AREA */}
          <div
            className="relative flex-1 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => { touchStartX.current = e.clientX; touchCurrentX.current = e.clientX; setIsPlaying(false); clearTimer(); }}
            onMouseUp={(e) => {
              const dx = e.clientX - touchStartX.current;
              const threshold = 20;
              if (dx > threshold) goPrev();
              else if (dx < -threshold) goNext();
              else setIsPlaying((p) => !p);
            }}
          >
            {/* full-bleed image */}
            <img
              src={stories[activeIndex].image}
              alt={stories[activeIndex].title}
              className="w-full h-full object-cover"
              style={{ maxHeight: "100vh" }}
            />

            {/* overlay controls on top of image */}
            {/* left zone */}
            <div
              onClick={goPrev}
              className="absolute left-0 top-0 h-full w-1/4 cursor-pointer"
              aria-hidden
            />
            {/* right zone */}
            <div
              onClick={goNext}
              className="absolute right-0 top-0 h-full w-1/4 cursor-pointer"
              aria-hidden
            />

            {/* semi-transparent bottom panel with title + button */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[92%] max-w-3xl">
              <div className="backdrop-blur-md bg-black/40 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {stories[activeIndex].title}
                    </h3>
                    <p className="text-sm text-gray-200/80 mt-1">
                      {stories[activeIndex].category || "Noma'lum"} · {stories[activeIndex].year || ""}
                    </p>
                  </div>
                </div>

                {/* BATAFSIL - full width clickable */}
                <button
                  onClick={() => navigate(`/movie/${stories[activeIndex].id}`)}
                  className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 active:scale-95 transition"
                >
                  Batafsil
                </button>
              </div>
            </div>

            {/* left / right chevron icons (semi transparent circles) */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
              aria-label="Oldingi"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
              aria-label="Keyingi"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
