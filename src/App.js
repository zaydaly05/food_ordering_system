import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import AnimatedBackground from "./components/AnimatedBackground";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./components/RequireAuth";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // showLogin is provided by AuthProvider below; create a small wrapper to access it
  function LoginModalController() {
    const { showLogin } = useAuth();
    return showLogin ? <LoginModal /> : null;
  }

  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col relative z-10">
          <AnimatedBackground />
          <Navbar setIsCartOpen={setIsCartOpen} />
          <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
          <Toaster />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/menu" element={<Home />} />
                <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />

                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

                <Route path="/admin" element={<RequireAuth><AdminLayout><Dashboard /></AdminLayout></RequireAuth>} />
                <Route path="/admin/products" element={<RequireAuth><AdminLayout><Products /></AdminLayout></RequireAuth>} />
                <Route path="/admin/orders" element={<RequireAuth><AdminLayout><OrdersAdmin /></AdminLayout></RequireAuth>} />

                <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          {/* show WhatsApp except on admin pages */}
          <ShowWhatsApp />
          <LoginModalController />
        </div>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

function ShowWhatsApp() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <WhatsAppButton phone="+15551234567" />;
}