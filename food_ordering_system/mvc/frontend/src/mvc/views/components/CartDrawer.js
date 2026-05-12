import { useCart } from "../../models/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useAuth } from "../../models/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate(); // ADDED: Initialize the navigate function

  const total = cart.reduce((sum, item) => {
    return sum + item.price * (item.quantity || 1);
  }, 0);

  const { isLoggedIn, openLogin, user } = useAuth();

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: 450 }}
            animate={{ x: 0 }}
            exit={{ x: 450 }}
            transition={{ type: "spring", damping: 24 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-orange-500" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X />
              </button>
            </div>

            {/* Cart Items */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="flex-1 overflow-y-auto p-4"
            >
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center text-gray-500"
                  >
                    <ShoppingCart size={70} className="mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Your cart is empty</p>
                    <p className="text-sm mt-1">Add some delicious meals 🍕</p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit="exit"
                      className="flex items-center justify-between gap-3 mb-4 bg-gray-50 p-3 rounded-2xl shadow-sm"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"

                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ${item.price}
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:scale-110 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <div className="border-t p-5 bg-white">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Delivery fees calculated at checkout
              </p>

              {!isLoggedIn && (
                <div className="mt-3 text-sm text-orange-500">
                  Sign in to continue to checkout
                </div>
              )}

              <button
                onClick={async () => {
                  if (!isLoggedIn) {
                    openLogin();
                    setIsOpen(false);
                    return;
                  }

                  try {
                    const cartData = {
                      userId: user.id,
                      items: cart.map((item) => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity || 1,
                        price: item.price,
                      })),
                      totalPrice: total,
                      paymentMethod: "PENDING",
                      status: "CHECKOUT",
                    };

                    const response = await fetch("http://localhost:8080/api/cart/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(cartData),
                    });

                    if (!response.ok) {
                      throw new Error("Failed to save cart");
                    }

                    const data = await response.json();
                    console.log("CART SAVED:", data);

                    localStorage.setItem("currentCartId", data.id); 

                    // CHANGED: Use navigate instead of window.location.href
                    setIsOpen(false); // Close the drawer first
                    navigate("/checkout"); // Then navigate cleanly
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className={`w-full mt-5 py-3 rounded-xl font-semibold transition ${
                  isLoggedIn
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoggedIn ? "Proceed to Checkout" : "Checkout"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}