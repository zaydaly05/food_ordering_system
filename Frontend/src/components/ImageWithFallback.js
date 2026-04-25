import { useState } from "react";

export default function ImageWithFallback({ src, alt = "", className = "", ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src || "/images/placeholder.svg");

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (currentSrc !== "/images/placeholder.svg") setCurrentSrc("/images/placeholder.svg");
      }}
      {...rest}
    />
  );
}
