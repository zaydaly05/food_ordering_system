import { useEffect, useState } from "react";

export default function Footer() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [embedIndex, setEmbedIndex] = useState(0);

  const embedUrls = [
    "https://www.google.com/maps?q=1600+Amphitheatre+Parkway,+Mountain+View&output=embed",
    "https://maps.google.com/maps?q=1600+Amphitheatre+Parkway,+Mountain+View&z=15&output=embed",
    "https://www.openstreetmap.org/export/embed.html?bbox=-122.088,37.419,-122.079,37.425&layer=mapnik&marker=37.422,-122.084",
  ];

  useEffect(() => {
    setIframeLoaded(false);
    setIframeFailed(false);

    const t = setTimeout(() => {
      if (!iframeLoaded) {
        if (embedIndex < embedUrls.length - 1) {
          setEmbedIndex((i) => i + 1);
        } else {
          setIframeFailed(true);
        }
      }
    }, 5000);

    return () => clearTimeout(t);
  }, [iframeLoaded, embedIndex, embedUrls.length]);

  return (
    <footer className="mt-12 border-t bg-white/60 backdrop-blur-sm z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">F</div>
            <div>
              <div className="font-bold">FoodApp</div>
              <div className="text-sm text-gray-500">Fresh meals delivered fast.</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</div>
          <div className="text-sm text-gray-500">Built with love and Tailwind CSS. Demo project.</div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:justify-center md:gap-20">
          

          <div className="ml-auto text-right">
            <div className="mb-3 font-semibold">Contact</div>
            <div className="mb-1 text-sm text-gray-600">foodapp32@gmail.com</div>
            <div className="mb-2 text-sm text-gray-600">+201210569661</div>

            
          </div>
        </div>

       
        
      </div>
    </footer>
  );
}
