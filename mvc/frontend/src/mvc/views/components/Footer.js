import { Link } from "react-router-dom";
import { useAuth } from "../../models/context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  const isCustomer = user?.role === "CUSTOMER";

  return (
    <footer className="mt-12 border-t bg-white dark:bg-slate-950 dark:border-slate-800 backdrop-blur-sm z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

        {/* Left section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              F
            </div>

            <div>
              <div className="font-bold text-black dark:text-white">
                FoodApp
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Fresh meals delivered fast.
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} FoodApp. All rights reserved.
          </div>
        </div>

        {/* Quick Links */}
        {isCustomer ? (
          <div className="flex flex-col items-start justify-center md:items-center">
            <div className="font-semibold text-black dark:text-white mb-2">
              Quick Links
            </div>

            <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">
              Home
            </Link>

            <Link to="/restaurants" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">
              Restaurants
            </Link>

            <Link to="/settings" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">
              Settings
            </Link>
          </div>
        ) : null}

        {/* Right section */}
        <div className="ml-auto text-right">
          <div className="mb-3 font-semibold text-black dark:text-white">
            Contact
          </div>

          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            foodapp32@gmail.com
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            +201210569661
          </div>
        </div>

      </div>
    </footer>
  );
}