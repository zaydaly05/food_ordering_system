export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} FoodApp — Fresh meals delivered.</div>

          <div className="flex gap-4 text-sm items-center mt-3">
            <a href="/about" className="hover:text-orange-500">About</a>
            <a href="#contact" className="hover:text-orange-500">Contact</a>
            <a href="#" className="hover:text-orange-500">Privacy</a>
            <div className="ml-4 text-sm text-gray-500">Built with ❤️ and Tailwind</div>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white rounded shadow p-2">
          <div className="text-sm font-semibold mb-2">Our Location</div>
          <div className="text-xs text-gray-500 mb-2">Deliveries available nearby — tap to open in Google Maps.</div>

          <div className="overflow-hidden rounded">
            <a href="https://www.google.com/maps/search/?api=1&query=1600+Amphitheatre+Parkway,+Mountain+View" target="_blank" rel="noreferrer">
              <iframe
                title="FoodApp location"
                src="https://www.google.com/maps?q=1600+Amphitheatre+Parkway,+Mountain+View&output=embed"
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
