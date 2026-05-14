import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDelivery } from "../../models/context/DeliveryContext";

const STATUS_STEPS = ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function DeliveryTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getDeliveryByOrder } = useDelivery();

  const orderId = searchParams.get("orderId");
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDeliveryByOrder(orderId);
        setDelivery(data);
      } catch (err) {
        setError("No delivery found for this order.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) load();
  }, [orderId, getDeliveryByOrder]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading delivery info...
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-xl mx-auto text-center min-h-screen bg-gray-100 dark:bg-slate-950">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="text-orange-500 underline"
        >
          Back to Orders
        </button>
      </div>
    );

  const currentStep = STATUS_STEPS.indexOf(delivery.deliveryStatus);

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen bg-gray-100 dark:bg-slate-950 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">
        Delivery Tracking
      </h1>

      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 relative">

        {STATUS_STEPS.map((step, idx) => (
          <div key={step} className="flex-1 flex flex-col items-center relative">

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                idx <= currentStep
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-400 dark:text-gray-500"
              }`}
            >
              {idx < currentStep ? "✓" : idx + 1}
            </div>

            <span
              className={`text-xs mt-1 text-center ${
                idx <= currentStep
                  ? "text-orange-500 font-medium"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {step.replace("_", " ")}
            </span>

            {idx < STATUS_STEPS.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  idx < currentStep
                    ? "bg-orange-400"
                    : "bg-gray-200 dark:bg-slate-700"
                }`}
              />
            )}

          </div>
        ))}

      </div>

      {/* Delivery Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-5 space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Order ID</span>
          <span className="font-mono text-xs">
            #{orderId?.slice(-8)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Recipient</span>
          <span className="font-medium">
            {delivery.deliveryPersonName}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Phone</span>
          <span className="font-medium">
            {delivery.deliveryPhone}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Address</span>
          <span className="font-medium text-right max-w-xs">
            {delivery.deliveryAddress}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">
            Estimated Time
          </span>
          <span className="font-medium text-orange-500">
            {delivery.estimatedDeliveryTime}
          </span>
        </div>

        <div className="flex justify-between border-t pt-2 border-gray-200 dark:border-slate-700">
          <span className="text-gray-500 dark:text-gray-400">
            Status
          </span>
          <span
            className={`font-bold ${
              delivery.deliveryStatus === "DELIVERED"
                ? "text-green-600 dark:text-green-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {delivery.deliveryStatus}
          </span>
        </div>

      </div>

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 w-full bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 text-white py-2 rounded-xl font-semibold transition"
      >
        Back to Orders
      </button>

    </div>
  );
}