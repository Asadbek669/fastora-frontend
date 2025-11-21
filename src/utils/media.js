

const API_BASE = "http://192.168.19.228:8000"; 

export async function resolvePoster(movie) {
  // ❗ poster_url JSON API bo‘lsa — qaytarmaymiz
  if (movie.poster_url && movie.poster_url.startsWith("https://api.telegram.org"))
    return movie.poster_url;

  if (movie.poster_file_id) {
    const res = await fetch(`${API_BASE}/tg/file/${movie.poster_file_id}`);
    const data = await res.json();
    return data.url;   // <<< REAL FILE PATH
  }

  return "/no-poster.png";
}

export async function resolveBackdrop(movie) {
  if (movie.backdrop_url && movie.backdrop_url.startsWith("https://api.telegram.org"))
    return movie.backdrop_url;

  if (movie.backdrop_file_id) {
    const res = await fetch(`${API_BASE}/tg/file/${movie.backdrop_file_id}`);
    const data = await res.json();
    return data.url;
  }

  return "/no-backdrop.png";
}

export async function resolveVideo(movie) {
  if (!movie?.video_file_id) return null;

  const res = await fetch(`${API_BASE}/tg/file/${movie.video_file_id}`);
  const data = await res.json();

  console.log("REAL VIDEO:", data.url);

  return data.url;
}
