import {
  ShoppingCart,
  Menu,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../models/context/CartContext";
import { useAuth } from "../../models/context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({ setIsCartOpen }) {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();

  const cartCount = (cart || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const { logout, isLoggedIn, openLogin, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-orange-500"
        >
          FoodApp
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-200">
          
          {isCustomer ? (
            <Link
              to="/orders"
              className="hover:text-orange-500 transition-colors duration-200"
            >
              Orders
            </Link>
          ) : null}

          {isCustomer ? (
            <Link
              to="/restaurants"
              className="hover:text-orange-500 transition-colors duration-200"
            >
              Restaurants
            </Link>
          ) : null}

          {isLoggedIn ? (
            <>
              {isCustomer ? (
                <Link
                  to="/profile"
                  className="hover:text-orange-500 transition-colors duration-200"
                >
                  Profile
                </Link>
              ) : null}

              <Link
                to="/settings"
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Settings
              </Link>

              {isAdmin ? (
                <Link
                  to="/admin"
                  className="hover:text-orange-500 transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              ) : null}

              <button
                onClick={() => {
                  logout();
                  toast.success("Signed out");
                  setTimeout(() => {
                    navigate("/");
                  }, 0);
                }}
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Sign out
              </button>
            </>
          ) : null}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Settings / Login */}
          {isLoggedIn ? (
            <button
              aria-label="Settings"
              onClick={() => navigate("/settings")}
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              <SettingsIcon />
            </button>
          ) : (
            <button
              onClick={() => openLogin()}
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              Login / Signup
            </button>
          )}

          {/* Cart */}
          {!isAdmin ? (
            <button
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCart className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors duration-200" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full text-xs px-2 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          
          <div className="flex flex-col p-4 gap-3 text-gray-700 dark:text-gray-200">
            
            {isCustomer ? (
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Orders
              </Link>
            ) : null}

            {isCustomer ? (
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Checkout
              </Link>
            ) : null}

            {isLoggedIn ? (
              <>
                {isCustomer ? (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                ) : null}

                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="hover:text-orange-500 transition-colors duration-200"
                >
                  Settings
                </Link>

                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                ) : null}

                <button
                  onClick={() => {
                    logout();
                    toast.success("Signed out");
                    setOpen(false);
                    navigate("/");
                  }}
                  className="text-left hover:text-orange-500 transition-colors duration-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openLogin();
                  setOpen(false);
                }}
                className="text-left hover:text-orange-500 transition-colors duration-200"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}