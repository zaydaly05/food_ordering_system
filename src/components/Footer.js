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
          <div className="pr-4 md:pr-6">
            <div className="mb-3 font-semibold">Quick links</div>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><a href="/" className="hover:text-orange-500">Home</a></li>
              <li><a href="/menu" className="hover:text-orange-500">Menu</a></li>
              <li><a href="/orders" className="hover:text-orange-500">My Orders</a></li>
              <li><a href="/about" className="hover:text-orange-500">Mission &amp; Vision</a></li>
            </ul>
          </div>

          <div className="md:ml-8">
            <div className="mb-3 font-semibold">Contact</div>
            <div className="mb-1 text-sm text-gray-600">support@foodapp.example</div>
            <div className="mb-2 text-sm text-gray-600">+1 (555) 123-4567</div>

            <div className="mt-2 flex gap-3 md:mt-3">
              <button type="button" aria-label="Social link placeholder" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" aria-label="Social link placeholder" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" aria-label="Social link placeholder" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="md:pl-6">
          <div className="mb-2 font-semibold">Our location</div>
          <div className="mb-2 text-xs text-gray-500">Tap to open in Google Maps</div>
          <div className="relative overflow-hidden rounded-lg border">
            {!iframeFailed ? (
              <iframe
                title="FoodApp location"
                src={embedUrls[embedIndex]}
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 text-sm text-gray-600">Map preview not available.</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1600+Amphitheatre+Parkway,+Mountain+View"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded bg-orange-500 px-4 py-2 text-white"
                >
                  Open in Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
