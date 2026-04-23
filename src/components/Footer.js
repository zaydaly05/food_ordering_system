import { useEffect, useState } from "react";

export default function Footer() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!iframeLoaded) setIframeFailed(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [iframeLoaded]);

  return (
    <footer className="mt-12 border-t bg-white/60 backdrop-blur-sm z-20">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">F</div>
            <div>
              <div className="font-bold">FoodApp</div>
              <div className="text-sm text-gray-500">Fresh meals delivered fast.</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">© {new Date().getFullYear()} FoodApp. All rights reserved.</div>
          <div className="text-sm text-gray-500">Built with ❤️ and Tailwind CSS · Demo project</div>
        </div>

        <div className="flex justify-between md:justify-center">
          <div>
            <div className="font-semibold mb-2">Quick links</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-orange-500">Home</a></li>
              <li><a href="/menu" className="hover:text-orange-500">Menu</a></li>
              <li><a href="/orders" className="hover:text-orange-500">My Orders</a></li>
              <li><a href="/about" className="hover:text-orange-500">About</a></li>
            </ul>
          </div>

          <div className="ml-6">
            <div className="font-semibold mb-2">Contact</div>
            <div className="text-sm text-gray-600">support@foodapp.example</div>
            <div className="text-sm text-gray-600">+1 (555) 123-4567</div>

            <div className="flex gap-3 mt-3">
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
            </div>
          </div>
        </div>

        <div className="md:pl-6">
          <div className="font-semibold mb-2">Our location</div>
          <div className="text-xs text-gray-500 mb-2">Tap to open in Google Maps</div>
          <div className="overflow-hidden rounded-lg border relative">
            {!iframeFailed ? (
              <iframe
                title="FoodApp location"
                src="https://www.google.com/maps?q=1600+Amphitheatre+Parkway,+Mountain+View&output=embed"
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
              />
            ) : (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-sm text-gray-600 mb-3">Map preview not available.</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1600+Amphitheatre+Parkway,+Mountain+View"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded"
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
