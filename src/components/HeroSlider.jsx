import { useEffect, useRef } from "react";
import NativeBanner from "./NativeBanner";

export default function HeroSlider() {
  const sliderRef = useRef(null);

  // 1 ta reklama slaydi — xohlasang yana qo‘shib beraman
  const banners = [{ id: "native1", type: "native" }];

  // AUTO SWIPE
  useEffect(() => {
    if (banners.length === 0) return;

    const slider = sliderRef.current;
    let index = 0;

    const interval = setInterval(() => {
      index++;
      if (index >= banners.length) index = 0;

      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <div className="mt-4">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x"
      >
        {banners.map((item) => (
          <div
            key={item.id}
            className="
              relative min-w-[70%] h-70 rounded-xl 
              overflow-hidden shadow-lg flex-shrink-0 snap-start
              bg-black/20
            "
          >
            <NativeBanner />
          </div>
        ))}
      </div>
    </div>
  );
}
