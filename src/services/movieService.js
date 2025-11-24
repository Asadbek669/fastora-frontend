const API_URL = "https://necessary-agna-akbarovasadbek777-c512a1db.koyeb.app";

/*  
  =======================================
      GLOBAL CACHE (ENG KUCHLI USUL)
  =======================================
  window.__fastoraCache = {
      movies: null,         // GET /movies
      movieDetails: {},     // GET /movies/:id
      search: {}            // /movies/search?q=
  };
*/

if (!window.__fastoraCache) {
  window.__fastoraCache = {
    movies: null,
    movieDetails: {},
    search: {}
  };
}

/*  
  =======================================
      NORMAL API FUNKSIYALARI
  =======================================
*/

// /movies (eski funksiya – kerak bo‘lsa ishlat)
export async function getMovies() {
  const res = await fetch(`${API_URL}/movies/`);
  return await res.json();
}

export async function getSeries() {
  const res = await fetch("/api/series");
  return res.json();
}

export async function getCartoons() {
  const res = await fetch("/api/cartoons");
  return res.json();
}

export async function getEpisode(id) {
  const res = await fetch(`${API_URL}/episodes/${id}`);
  return await res.json();
}

// /movies/:id
export async function getMovie(id) {
  const res = await fetch(`${API_URL}/movies/${id}`);
  return await res.json();
}

// like qo‘shish
export async function addLike(id) {
  const res = await fetch(`${API_URL}/movies/${id}/like`, {
    method: "POST",
  });
  return await res.json();
}

// like olib tashlash
export async function removeLike(id) {
  const res = await fetch(`${API_URL}/movies/${id}/unlike`, {
    method: "POST",
  });
  return await res.json();
}

// kommentlar
export async function getComments(id) {
  const res = await fetch(`${API_URL}/comments/${id}`);
  return await res.json();
}

// komment yuborish
export async function sendComment(movieId, user, text) {
  const res = await fetch(`${API_URL}/comments/${movieId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, text }),
  });
  return await res.json();
}

/*  
  =======================================
      1) CACHED BARCHA FILMLAR
  =======================================
*/
export async function getMoviesCached() {
  // cache bo‘lsa serverga so‘rov yubormaymiz
  if (window.__fastoraCache.movies) {
    console.log("📦 Movies from CACHE");
    return window.__fastoraCache.movies;
  }

  console.log("🌐 Movies from API");

  const res = await fetch(`${API_URL}/movies/`);
  if (!res.ok) throw new Error("API xatolik!");

  const data = await res.json();
  window.__fastoraCache.movies = data;

  return data;
}

/*  
  =======================================
      2) CACHED BITTA FILM
  =======================================
*/
export async function getMovieCached(id) {
  if (window.__fastoraCache.movieDetails[id]) {
    console.log(`📦 Movie ${id} from CACHE`);
    return window.__fastoraCache.movieDetails[id];
  }

  console.log(`🌐 Movie ${id} from API`);

  const res = await fetch(`${API_URL}/movies/${id}`);
  if (!res.ok) throw new Error("API xatolik!");

  const data = await res.json();
  window.__fastoraCache.movieDetails[id] = data;

  return data;
}

/*  
  =======================================
      3) CACHED SEARCH (qidiruv)
  =======================================
*/
export async function searchMoviesCached(q) {
  if (window.__fastoraCache.search[q]) {
    console.log(`📦 Search '${q}' from CACHE`);
    return window.__fastoraCache.search[q];
  }

  console.log(`🌐 Search '${q}' from API`);

  const res = await fetch(`${API_URL}/movies/search?q=${q}`);
  if (!res.ok) throw new Error("API xatolik!");

  const data = await res.json();
  window.__fastoraCache.search[q] = data;

  return data;
}
