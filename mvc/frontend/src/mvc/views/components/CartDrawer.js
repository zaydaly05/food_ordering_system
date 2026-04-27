import { useCart } from "../../models/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useAuth } from "../../models/context/AuthContext";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const { isLoggedIn, openLogin } = useAuth();

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
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
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-4"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Cart</h2>
              <X onClick={() => setIsOpen(false)} />
            </div>

            <motion.div variants={listVariants} initial="hidden" animate="show" className="flex flex-col">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">Your cart is empty.</motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div key={item.id + Math.random()} variants={itemVariants} exit="exit" className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                          <Trash2 />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-4 font-bold">Total: ${total}</div>

            {!isLoggedIn ? (
              <div className="mt-4 text-sm text-gray-600">Sign in to proceed to checkout.</div>
            ) : null}

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  openLogin();
                  setIsOpen(false);
                  return;
                }
              }}
              className={`w-full mt-4 py-2 rounded ${isLoggedIn ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              {isLoggedIn ? <a href="/checkout">Checkout</a> : "Checkout"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
