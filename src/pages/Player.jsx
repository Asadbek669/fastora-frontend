import { useEffect, useState } from "react";

export default function Player({ movie }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (movie?.video_url) {
      setVideoUrl(movie.video_url);
    }
  }, [movie]);

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center">
      {videoUrl ? (
        <video
          controls
          src={videoUrl}
          className="max-w-full max-h-screen object-contain"
        />
      ) : (
        <p className="text-center text-white">Video yuklanmoqda...</p>
      )}
    </div>
  );
}
