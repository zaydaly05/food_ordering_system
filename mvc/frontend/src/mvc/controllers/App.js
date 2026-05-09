import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../views/components/Navbar";
import CartDrawer from "../views/components/CartDrawer";
import AnimatedBackground from "../views/components/AnimatedBackground";
import Home from "../views/pages/Home";
import Landing from "../views/pages/Landing";
import About from "../views/pages/About";
import Checkout from "../views/pages/Checkout";
import Orders from "../views/pages/Orders";
import Login from "../views/pages/Login";
import ProductDetail from "../views/pages/ProductDetail";
import NotFound from "../views/pages/NotFound";
import Profile from "../views/pages/Profile";
import Settings from "../views/pages/Settings";

import Dashboard from "../views/pages/admin/Dashboard";
import Products from "../views/pages/admin/Products";
import OrdersAdmin from "../views/pages/admin/OrdersAdmin";
import Users from "../views/pages/admin/Users";
import AdminLayout from "../views/layouts/AdminLayout";
import RequireAuth from "../views/components/RequireAuth";

import { CartProvider } from "../models/context/CartContext";
import { AuthProvider } from "../models/context/AuthContext";
import { useAuth } from "../models/context/AuthContext";
import { OrdersProvider } from "../models/context/OrdersContext";
import { USER_ROLES } from "../models/context/AuthContext";
import LoginModal from "../views/components/LoginModal";
import { Toaster } from "react-hot-toast";
import Footer from "../views/components/Footer";
import WhatsAppButton from "../views/components/WhatsAppButton";

import RestaurantsAdmin from "../views/pages/admin/RestaurantsAdmin";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  function LoginModalController() {
    const { showLogin } = useAuth();
    return showLogin ? <LoginModal /> : null;
  }

  return (
    <AuthProvider>
      <OrdersProvider>
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

                  <Route
                    path="/checkout"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.CUSTOMER]}>
                        <Checkout />
                      </RequireAuth>
                    }
                  />

                  <Route path="/orders" element={<Orders />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<About />} />

                  <Route
                    path="/product/:id"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.CUSTOMER]}>
                        <ProductDetail />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.CUSTOMER]}>
                        <Profile />
                      </RequireAuth>
                    }
                  />

                  <Route path="/settings" element={<Settings />} />

                  <Route
                    path="/admin"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                        <AdminLayout><Dashboard /></AdminLayout>
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/admin/products"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                        <AdminLayout><Products /></AdminLayout>
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/admin/orders"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                        <AdminLayout><OrdersAdmin /></AdminLayout>
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/admin/users"
                    element={
                      <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                        <AdminLayout><Users /></AdminLayout>
                      </RequireAuth>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
<Route
  path="/admin/restaurants"
  element={
    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
      <AdminLayout>
        <RestaurantsAdmin />
      </AdminLayout>
    </RequireAuth>
  }
/>

                </Routes>
              </main>

              <Footer />
              <ShowWhatsApp />
              <LoginModalController />
            </div>

          </BrowserRouter>
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}


function ShowWhatsApp() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <WhatsAppButton phone="+15551234567" />;
}