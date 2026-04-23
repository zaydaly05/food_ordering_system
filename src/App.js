import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import AdminLayout from "./layouts/AdminLayout";

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
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetail />} />

                <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/admin/products" element={<AdminLayout><Products /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout><OrdersAdmin /></AdminLayout>} />

                <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <WhatsAppButton phone="+15551234567" />
          <LoginModalController />
        </div>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}