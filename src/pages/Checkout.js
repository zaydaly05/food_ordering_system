import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, it) => s + it.price, 0);
  const serviceFeeRate = 0.05; // 5%
  const vatRate = 0.10; // 10%
  const deliveryFeeFixed = 3; // fixed delivery charge

  const serviceFee = Number((subtotal * serviceFeeRate).toFixed(2));
  const vat = Number(((subtotal + serviceFee) * vatRate).toFixed(2));
  const isDelivery = address.trim().length > 0;
  const deliveryFee = isDelivery ? deliveryFeeFixed : 0;
  const total = Number((subtotal + serviceFee + vat + deliveryFee).toFixed(2));

  const simulatePayment = async () => {
    // fake processing delay
    await new Promise((r) => setTimeout(r, 900));
    return { status: "paid", provider: paymentMethod };
  };

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!address) return toast.error("Please enter an address");

    if (paymentMethod === "credit") {
      // basic validation
      if (!card.number || !card.name || !card.exp || !card.cvv) return toast.error("Please fill card details");
    }

    setPlacing(true);

    let paymentResult = { status: "pending", provider: paymentMethod };

    if (paymentMethod === "instapay" || paymentMethod === "credit") {
      paymentResult = await simulatePayment();
    }

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart,
      subtotal,
      serviceFee,
      vat,
      deliveryFee,
      total,
      address,
      paymentMethod,
      paymentStatus: paymentResult.status,
    };

    const saved = JSON.parse(localStorage.getItem("demo_orders") || "[]");
    saved.unshift(order);
    localStorage.setItem("demo_orders", JSON.stringify(saved));

    // small delay to show animation
    await new Promise((r) => setTimeout(r, 500));

    clearCart();
    setPlacing(false);
    toast.success(paymentResult.status === "paid" ? "Payment successful, order placed" : "Order placed (payment pending)");
    navigate("/orders");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Delivery</h2>
          <input value={address} onChange={e => setAddress(e.target.value)} className="border p-2 w-full" placeholder="Address" />

          <div className="mt-4">
            <h3 className="font-semibold">Payment</h3>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="pm" checked={paymentMethod === "instapay"} onChange={() => setPaymentMethod("instapay")} />
                <span>Instapay (fast online)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="pm" checked={paymentMethod === "credit"} onChange={() => setPaymentMethod("credit")} />
                <span>Credit / Debit Card</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === "credit" && (
              <div className="mt-3 grid grid-cols-1 gap-2">
                <input placeholder="Card number" value={card.number} onChange={e => setCard(c => ({...c, number: e.target.value}))} className="border p-2" />
                <input placeholder="Name on card" value={card.name} onChange={e => setCard(c => ({...c, name: e.target.value}))} className="border p-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM/YY" value={card.exp} onChange={e => setCard(c => ({...c, exp: e.target.value}))} className="border p-2" />
                  <input placeholder="CVV" value={card.cvv} onChange={e => setCard(c => ({...c, cvv: e.target.value}))} className="border p-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Order Summary</h2>

          <div className="flex flex-col gap-2 max-h-56 overflow-auto">
            {cart.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>{it.name}</span>
                <span>${it.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Service (5%)</span><span>${serviceFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>VAT (10%)</span><span>${vat.toFixed(2)}</span></div>
            {isDelivery && <div className="flex justify-between text-sm text-gray-600"><span>Delivery fee</span><span>${deliveryFee.toFixed(2)}</span></div>}
            <div className="mt-2 font-bold">Total: ${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={placeOrder}
        disabled={placing}
        className="mt-6 bg-orange-500 text-white w-full py-3 rounded"
      >
        {placing ? "Processing..." : "Place Order"}
      </motion.button>
    </div>
  );
}