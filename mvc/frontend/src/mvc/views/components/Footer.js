import { Link } from "react-router-dom";

export default function Footer() {

  return (
    <footer className="mt-12 border-t bg-white/60 backdrop-blur-sm z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

        {/* Left section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              F
            </div>
            <div>
              <div className="font-bold">FoodApp</div>
              <div className="text-sm text-gray-500">
                Fresh meals delivered fast.
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} FoodApp. All rights reserved.
          </div>

          
        </div>

        {/* Center (empty for now or future links) */}
        <div className="flex flex-col items-start justify-center md:items-center">
          <div className="font-semibold mb-2">Quick Links</div>
          <Link to="/" className="text-sm text-gray-600 hover:text-orange-500">Home</Link>
          <Link to="/restaurants" className="text-sm text-gray-600 hover:text-orange-500">Restaurants</Link>
          <Link to="/settings" className="text-sm text-gray-600 hover:text-orange-500">Settings</Link>
        </div>

        {/* Right section */}
        <div className="ml-auto text-right">
          <div className="mb-3 font-semibold">Contact</div>
          <div className="mb-1 text-sm text-gray-600">
            foodapp32@gmail.com
          </div>
          <div className="text-sm text-gray-600">
            +201210569661
          </div>
        </div>

      </div>
    </footer>
  );
}