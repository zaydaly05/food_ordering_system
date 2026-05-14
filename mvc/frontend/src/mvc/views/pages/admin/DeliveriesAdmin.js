import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDelivery } from "../../../models/context/DeliveryContext";

export default function DeliveriesAdmin() {
  const { getAllDeliveries, updateDeliveryStatus, deleteDelivery } =
    useDelivery();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllDeliveries();
        setDeliveries(data);
      } catch (err) {
        toast.error("Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getAllDeliveries]);

  const changeStatus = async (deliveryId, newStatus) => {
    try {
      setSavingId(deliveryId);
      await updateDeliveryStatus(deliveryId, newStatus);
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, deliveryStatus: newStatus } : d,
        ),
      );
      toast.success("Delivery status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteDelivery = async (deliveryId) => {
    try {
      await deleteDelivery(deliveryId);
      setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
      toast.success("Delivery deleted");
    } catch (err) {
      toast.error("Failed to delete delivery");
    }
  };

  const statusColor = (status) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700";
    if (status === "OUT_FOR_DELIVERY") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading deliveries...</div>;

  return (
  <div className="p-6 bg-gray-100 dark:bg-slate-950 min-h-screen">

    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Deliveries
    </h1>

    {deliveries.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">
        No deliveries found.
      </p>
    ) : (
      <div className="grid gap-4">

        {deliveries.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-5"
          >

            <div className="flex justify-between items-start mb-3">

              <div>
                <h2 className="font-bold text-gray-800 dark:text-white">
                  Delivery #{d.id?.slice(-8)}
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  Order: #{d.orderId?.slice(-8)}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {d.createdAt ? new Date(d.createdAt).toLocaleString() : ""}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                  d.deliveryStatus
                )}`}
              >
                {d.deliveryStatus}
              </span>

            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">

              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">
                  Recipient
                </span>
                <span className="font-medium">
                  {d.deliveryPersonName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">
                  Phone
                </span>
                <span className="font-medium">
                  {d.deliveryPhone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">
                  Address
                </span>
                <span className="font-medium text-right max-w-xs">
                  {d.deliveryAddress}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-500">
                  Est. Time
                </span>
                <span className="font-medium text-orange-500">
                  {d.estimatedDeliveryTime}
                </span>
              </div>

            </div>

            <div className="flex justify-between border-t pt-3 border-gray-200 dark:border-slate-700">

              <button
                onClick={() => handleDeleteDelivery(d.id)}
                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Delete Delivery
              </button>

              <select
                value={d.deliveryStatus}
                disabled={savingId === d.id}
                onChange={(e) => changeStatus(d.id, e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
              >
                <option value="PENDING">PENDING</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>

            </div>

          </div>
        ))}

      </div>
    )}
  </div>
);
}