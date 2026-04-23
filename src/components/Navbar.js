import { ShoppingCart, Menu, X, Settings as SettingsIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({ setIsCartOpen }) {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout, isLoggedIn, openLogin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-extrabold text-orange-500">
          FoodApp
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/menu" className="hover:text-orange-500">Menu</Link>
          <Link to="/orders" className="hover:text-orange-500">Orders</Link>
          <Link to="/checkout" className="hover:text-orange-500">Checkout</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-orange-500">Profile</Link>
              <Link to="/settings" className="hover:text-orange-500">Settings</Link>
              <button onClick={() => { logout(); toast.success("Signed out"); navigate('/'); }} className="hover:text-orange-500">Sign out</button>
            </>
          ) : (
            <button onClick={() => openLogin()} className="hover:text-orange-500">Login</button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              aria-label="Settings"
              onClick={() => navigate('/settings')}
              className="text-gray-600 hover:text-orange-500"
            >
              <SettingsIcon />
            </button>
          ) : (
            <button onClick={() => openLogin()} className="text-gray-600 hover:text-orange-500">Login / Signup</button>
          )}
          <button
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="cursor-pointer" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cart.length}</span>
            )}
          </button>

          <button className="md:hidden" onClick={() => setOpen(v => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col p-4 gap-3">
            <Link to="/menu" onClick={() => setOpen(false)}>Menu</Link>
            <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
            <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
                <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link>
                <button onClick={() => { logout(); toast.success("Signed out"); setOpen(false); navigate('/'); }}>Sign out</button>
              </>
            ) : (
              <button onClick={() => { openLogin(); setOpen(false); }}>Login</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}