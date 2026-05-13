import React, { useEffect, useState } from "react";

/**
 * Automatic image carousel. Pass slides from `src/assets/slider/sliderImages.js`
 * or any array of `{ src, alt }`.
 */
export default function HeroImageSlider({
  slides,
  intervalMs = 3000,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides?.length ?? 0;

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs, paused]);

  if (!count) return null;

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-white/50 shadow-lg ring-1 ring-orange-200/60 md:ml-auto"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured dishes"
      >
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            draggable={false}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      {count > 1 && (
        <div
          className="mt-4 flex justify-center gap-2 md:justify-end"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-[#f57c24]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
