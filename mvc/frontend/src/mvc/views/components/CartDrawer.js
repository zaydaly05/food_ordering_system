import { useCart } from "../../models/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useAuth } from "../../models/context/AuthContext";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, removeFromCart } = useCart();
  const { isLoggedIn, openLogin } = useAuth();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          <motion.div className="fixed right-0 top-0 h-full w-80 bg-white z-50 p-4">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Cart</h2>
              <X onClick={() => setIsOpen(false)} />
            </div>

            {cart.length === 0 ? (
              <div>Your cart is empty</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between mb-3">
                  <div>
                    <div>{item.name}</div>
                    <div>${item.price}</div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))
            )}

            <div className="mt-4 font-bold">
              Total: ${total.toFixed(2)}
            </div>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  openLogin();
                  return;
                }
              }}
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded"
            >
              Checkout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}