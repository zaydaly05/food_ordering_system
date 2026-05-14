import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePayment } from "../../models/context/PaymentContext";
import { useDelivery } from "../../models/context/DeliveryContext";
import { useAuth } from "../../models/context/AuthContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getPaymentByOrder } = usePayment();
  const { createDelivery } = useDelivery();
  const { user } = useAuth();

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  const [payment, setPayment] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingDelivery, setCreatingDelivery] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");

  // Delivery form state
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryPersonName: "",
    deliveryPhone: "",
    deliveryAddress: user?.address || "",
    estimatedDeliveryTime: "30-45 minutes",
  });

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const data = await getPaymentByOrder(orderId);
        setPayment(data);
      } catch (err) {
        console.error("Failed to load payment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) loadPayment();
  }, [orderId, getPaymentByOrder]);

  const handleCreateDelivery = async () => {
    if (!deliveryForm.deliveryPersonName || !deliveryForm.deliveryPhone || !deliveryForm.deliveryAddress) {
      setDeliveryError("Please fill in all delivery fields");
      return;
    }
    setDeliveryError("");
    setCreatingDelivery(true);
    try {
      const data = await createDelivery({ orderId, ...deliveryForm });
      setDelivery(data);
    } catch (err) {
      setDeliveryError(err.message || "Failed to create delivery");
    } finally {
      setCreatingDelivery(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 p-10">
        <div className="text-gray-500">Loading payment details...</div>
      </div>
    );
  }

 return (
  <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-100 dark:bg-slate-950 text-black dark:text-white">

    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center mb-6">

      <div className="text-5xl mb-3">✅</div>

      <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
        Payment Successful!
      </h1>

      <p className="text-green-600 dark:text-green-300">
        Your order has been placed and payment confirmed.
      </p>

    </div>

    {payment && (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-5 mb-6">

        <h2 className="font-bold text-gray-800 dark:text-white mb-3">
          Payment Details
        </h2>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">

          <div className="flex justify-between">
            <span>Payment ID</span>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
              #{payment.id?.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
              #{orderId?.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Method</span>
            <span className="font-medium">
              {payment.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {payment.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between font-bold text-gray-800 dark:text-white border-t pt-2 mt-2 border-gray-200 dark:border-slate-700">
            <span>Amount Paid</span>
            <span className="text-orange-500">
              {payment.totalAmount?.toFixed(2)} EGP
            </span>
          </div>

        </div>

      </div>
    )}

    {!delivery ? (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-5 mb-6">

        <h2 className="font-bold text-gray-800 dark:text-white mb-3">
          🚚 Schedule Delivery
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Fill in delivery details to track your order.
        </p>

        <div className="space-y-3">

          <input
            value={deliveryForm.deliveryPersonName}
            onChange={(e) =>
              setDeliveryForm({
                ...deliveryForm,
                deliveryPersonName: e.target.value
              })
            }
            className="border p-2 w-full rounded bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            placeholder="Recipient Name"
          />

          <input
            value={deliveryForm.deliveryPhone}
            onChange={(e) =>
              setDeliveryForm({
                ...deliveryForm,
                deliveryPhone: e.target.value
              })
            }
            className="border p-2 w-full rounded bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            placeholder="Phone Number"
          />

          <input
            value={deliveryForm.deliveryAddress}
            onChange={(e) =>
              setDeliveryForm({
                ...deliveryForm,
                deliveryAddress: e.target.value
              })
            }
            className="border p-2 w-full rounded bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            placeholder="Delivery Address"
          />

          <select
            value={deliveryForm.estimatedDeliveryTime}
            onChange={(e) =>
              setDeliveryForm({
                ...deliveryForm,
                estimatedDeliveryTime: e.target.value
              })
            }
            className="border p-2 w-full rounded bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
          >
            <option value="20-30 minutes">20-30 minutes</option>
            <option value="30-45 minutes">30-45 minutes</option>
            <option value="45-60 minutes">45-60 minutes</option>
            <option value="60-90 minutes">60-90 minutes</option>
          </select>

        </div>

        {deliveryError && (
          <p className="text-red-500 text-sm mt-2">
            {deliveryError}
          </p>
        )}

        <button
          onClick={handleCreateDelivery}
          disabled={creatingDelivery}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-xl font-semibold transition"
        >
          {creatingDelivery ? "Scheduling..." : "Schedule Delivery"}
        </button>

      </div>
    ) : (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-5 mb-6">

        <h2 className="font-bold text-gray-800 dark:text-white mb-3">
          🚚 Delivery Scheduled
        </h2>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">

          <div className="flex justify-between">
            <span>Recipient</span>
            <span className="font-medium">
              {delivery.deliveryPersonName}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Phone</span>
            <span className="font-medium">
              {delivery.deliveryPhone}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Address</span>
            <span className="font-medium">
              {delivery.deliveryAddress}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Time</span>
            <span className="font-medium text-orange-500">
              {delivery.estimatedDeliveryTime}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {delivery.deliveryStatus}
            </span>
          </div>

        </div>

      </div>
    )}

    <div className="flex gap-3">

      <button
        onClick={() => navigate("/orders")}
        className="flex-1 bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 text-white py-2 rounded-xl font-semibold transition"
      >
        View My Orders
      </button>

      <button
        onClick={() => navigate("/restaurants")}
        className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 py-2 rounded-xl font-semibold transition"
      >
        Order More
      </button>

    </div>

  </div>
);
}