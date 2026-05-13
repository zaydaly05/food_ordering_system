import toast from "react-hot-toast";
import { useCart } from "../../models/context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../models/context/AuthContext";
import { useOrders } from "../../models/context/OrdersContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const { createOrder } = useOrders();

  const navigate = useNavigate();
  const { isLoggedIn, openLogin } = useAuth();

  const subtotal = cart.reduce(
    (s, it) => s + it.price * (it.quantity || 1),
    0
  );

  const serviceFeeRate = 0.05;
  const vatRate = 0.1;
  const deliveryFeeFixed = 0.04;

  const serviceFee = Number((subtotal * serviceFeeRate).toFixed(2));
  const vat = Number(((subtotal + serviceFee) * vatRate).toFixed(2));

  const deliveryFee = Number((subtotal * deliveryFeeFixed).toFixed(2));

  const total = Number(
    (subtotal + serviceFee + vat + deliveryFee).toFixed(2)
  );

  const { user } = useAuth();

  const placeOrder = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!address) return toast.error("Please enter an address");

    setPlacing(true);

    try {
      const order = await createOrder({
        userId: user?.id,   
        items: cart,
        address,
        total,
        paymentMethod,
      });

      clearCart();
      toast.success("Order created!");
      navigate(`/payment/${order.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
            placeholder="Address"
          />

          <div className="mt-4">
            <h3 className="font-semibold">Payment</h3>

            <div className="flex flex-col gap-2 mt-2">
              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "instapay"}
                  onChange={() => setPaymentMethod("instapay")}
                /> Instapay
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "credit"}
                  onChange={() => setPaymentMethod("credit")}
                /> Credit Card
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                /> Cash
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold">Summary</h2>

          {cart.map((it, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {it.quantity || 1}x {it.name}
              </span>
              <span>{(it.price * (it.quantity || 1)).toFixed(2)} EGP</span>
            </div>
          ))}
           <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Service Fee (5%)</span>
            <span>{serviceFee.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>VAT (10%)</span>
            <span>{vat.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Delivery Fee (4%)</span>
            <span>{deliveryFee.toFixed(2)} EGP</span>
          </div>

          <hr className="my-2" />
          <div className="mt-4 font-bold">
            Total: {total.toFixed(2)} EGP
          </div>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={placing}
        className="mt-6 w-full bg-orange-500 text-white py-3 rounded"
      >
        {placing ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}