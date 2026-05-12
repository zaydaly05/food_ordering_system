import toast from "react-hot-toast";
import { useCart } from "../../models/context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../models/context/AuthContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [card, setCard] = useState({
    number: "",
    name: "",
    exp: "",
    cvv: "",
  });

  const navigate = useNavigate();
  const { isLoggedIn, openLogin } = useAuth();

  // CHANGED: Fixed math to multiply by quantity to prevent incorrect logic
  const subtotal = cart.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  
  const serviceFeeRate = 0.05;
  const vatRate = 0.1;
  const deliveryFeeFixed = 3;

  const serviceFee = Number((subtotal * serviceFeeRate).toFixed(2));
  const vat = Number(((subtotal + serviceFee) * vatRate).toFixed(2));

  const isDelivery = address.trim().length > 0;
  const deliveryFee = isDelivery ? deliveryFeeFixed : 0;

  const total = Number(
    (subtotal + serviceFee + vat + deliveryFee).toFixed(2)
  );

  const placeOrder = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!address) return toast.error("Please enter an address");

    if (paymentMethod === "credit") {
      if (!card.number || !card.name || !card.exp || !card.cvv) {
        return toast.error("Please fill card details");
      }
    }

    setPlacing(true);

    try {
      const cartId = localStorage.getItem("currentCartId");

      if (!cartId) {
        throw new Error("No cart ID found. Please go back to cart.");
      }

      let backendPaymentFormat = paymentMethod.toUpperCase();
      if (backendPaymentFormat === "COD") backendPaymentFormat = "CASH";
      if (backendPaymentFormat === "CREDIT") backendPaymentFormat = "VISA";

      const response = await fetch(
        `http://localhost:8080/api/cart/${cartId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: backendPaymentFormat,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment method");
      }

      await response.json();

      clearCart();
      localStorage.removeItem("currentCartId");

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery + Payment */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Delivery</h2>

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
            placeholder="Address"
          />

          <div className="mt-4">
            <h3 className="font-semibold">Payment</h3>

            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "instapay"}
                  onChange={() => setPaymentMethod("instapay")}
                />
                Instapay
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                />
                Credit Card
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
            </div>

            {paymentMethod === "credit" && (
              <div className="mt-3 space-y-2">
                <input
                  className="border p-2 w-full"
                  placeholder="Card Number"
                  value={card.number}
                  onChange={(e) =>
                    setCard({ ...card, number: e.target.value })
                  }
                />

                <input
                  className="border p-2 w-full"
                  placeholder="Name on Card"
                  value={card.name}
                  onChange={(e) =>
                    setCard({ ...card, name: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border p-2"
                    placeholder="MM/YY"
                    value={card.exp}
                    onChange={(e) =>
                      setCard({ ...card, exp: e.target.value })
                    }
                  />

                  <input
                    className="border p-2"
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard({ ...card, cvv: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Order Summary</h2>

          <div className="space-y-2 max-h-60 overflow-auto">
            {cart.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>{it.quantity || 1}x {it.name}</span>
                <span>${(it.price * (it.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT</span>
              <span>${vat.toFixed(2)}</span>
            </div>

            {isDelivery && (
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={placeOrder}
        disabled={placing}
        className="mt-6 w-full bg-orange-500 text-white py-3 rounded"
      >
        {placing ? "Processing..." : "Place Order"}
      </motion.button>
    </div>
  );
}