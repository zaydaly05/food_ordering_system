import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../views/components/Navbar";
import CartDrawer from "../views/components/CartDrawer";
import AnimatedBackground from "../views/components/AnimatedBackground";

import Landing from "../views/pages/Landing";
import About from "../views/pages/About";
import Checkout from "../views/pages/Checkout";
import Orders from "../views/pages/Orders";
import Login from "../views/pages/Login";

import NotFound from "../views/pages/NotFound";
import Profile from "../views/pages/Profile";
import Settings from "../views/pages/Settings";

import Dashboard from "../views/pages/admin/Dashboard";

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
import Restaurants from "../views/pages/Restaurant";
import RestaurantDetails from "../views/pages/RestaurantDetails";

import MenuitemsAdmin from "../views/pages/admin/MenuitemsAdmin";
import PaymentsAdmin from "../views/pages/admin/PaymentsAdmin";
import DeliveriesAdmin from "../views/pages/admin/DeliveriesAdmin";
import PaymentSuccess from "../views/pages/PaymentSuccess";
import PaymentFailure from "../views/pages/PaymentFailure";
import DeliveryTracking from "../views/pages/DeliveryTracking";
import { PaymentProvider } from "../models/context/PaymentContext";
import { DeliveryProvider } from "../models/context/DeliveryContext";

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
          <PaymentProvider>
            <DeliveryProvider>
          <BrowserRouter>

            <div className="min-h-screen flex flex-col relative z-10">
              <AnimatedBackground />
              <Navbar setIsCartOpen={setIsCartOpen} />
              <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
              <Toaster />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                 

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
                  <Route
  path="/admin/menuitems"
  element={
    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
      <AdminLayout>
        <MenuitemsAdmin />
      </AdminLayout>
    </RequireAuth>
  }
/>

                  
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
<Route
  path="/restaurants"
  element={<Restaurants />}
/>

<Route
  path="/restaurants/:id"
  element={<RestaurantDetails />}
/>
                  <Route path="/payment/success" element={
                    <RequireAuth allowedRoles={[USER_ROLES.CUSTOMER]}>
                      <PaymentSuccess />
                    </RequireAuth>
                  } />
                  <Route path="/payment/failure" element={<PaymentFailure />} />
                  <Route path="/delivery/tracking" element={
                    <RequireAuth allowedRoles={[USER_ROLES.CUSTOMER]}>
                      <DeliveryTracking />
                    </RequireAuth>
                  } />

                  <Route path="/admin/payments" element={
                    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminLayout><PaymentsAdmin /></AdminLayout>
                    </RequireAuth>
                  } />
                  <Route path="/admin/deliveries" element={
                    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminLayout><DeliveriesAdmin /></AdminLayout>
                    </RequireAuth>
                  } />

<Route path="*" element={<NotFound />} />

                </Routes>
              </main>

              <Footer />
              <ShowWhatsApp />
              <LoginModalController />
            </div>

          </BrowserRouter>
            </DeliveryProvider>
          </PaymentProvider>
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