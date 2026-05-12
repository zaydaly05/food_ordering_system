import { useCart } from "../../models/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useAuth } from "../../models/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, removeFromCart, updateQuantity  } = useCart();
  const { isLoggedIn, openLogin } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
            <div key={item.productId} className="flex justify-between mb-3">

              <div>
                <div>{item.name}</div>

                <div className="text-sm text-gray-600">
                  {item.price} EGP
                </div>

                
                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>

                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500"
              >
                <Trash2 />
              </button>

            </div>
          ))
            )}

            <div className="mt-4 font-bold">
              Total: {total.toFixed(2)} EGP
            </div>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  openLogin();
                  return;
                }
                navigate('/checkout');
                setIsOpen(false);
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