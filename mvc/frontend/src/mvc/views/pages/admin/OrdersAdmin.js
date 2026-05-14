import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useOrders } from "../../../models/context/OrdersContext.js";

export default function OrdersAdmin() {
  const { getAllOrders, updateOrderStatus, deleteOrder } = useOrders();
  const [orders, setOrders] = useState(() => {
  const cached = localStorage.getItem("orders");
  return cached ? JSON.parse(cached) : [];
  });
  const [savingOrderId, setSavingOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const dbOrders = await getAllOrders();

        setOrders(dbOrders);

        localStorage.setItem("orders", JSON.stringify(dbOrders));
      } catch (err) {
        toast.error("Failed to load orders");
      }
    };

    loadOrders();
  }, [getAllOrders]);

  const changeStatus = async (orderId, newStatus) => {

  const previousOrders = orders;
  const updatedOrders = orders.map((o) =>
    String(o.id || o._id) === String(orderId)
      ? { ...o, status: newStatus }
      : o
  );

  setOrders(updatedOrders);

  localStorage.setItem("orders", JSON.stringify(updatedOrders));

  try {
    setSavingOrderId(orderId);

    await updateOrderStatus(orderId, newStatus);

    toast.success("Order status updated");
  } catch (err) {
    // Rollback if API fails
    setOrders(previousOrders);
    localStorage.setItem("orders", JSON.stringify(previousOrders));

    toast.error("Failed to update order status");
  } finally {
    setSavingOrderId(null);
  }
};

  const handleDeleteOrder = async (orderId) => {
  
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((o) => String(o.id || o._id) !== String(orderId)));
      toast.success("Order deleted");
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No orders yet.
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((o) => (
            <div
              key={o.id || o._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-5 transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                    Order #
                    {o.id?.slice(-8) ||
                      o._id?.slice(-8)}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {o.createdAt
                      ? new Date(
                          o.createdAt
                        ).toLocaleString()
                      : "No date"}
                  </p>

                  {/* User Info */}
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      <span className="font-medium">
                        Customer:
                      </span>{" "}
                      {o.userName || "Unknown"}
                    </p>

                    <p>
                      <span className="font-medium">
                        Phone:
                      </span>{" "}
                      {o.phone || "No phone"}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    o.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : o.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {o.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2 text-sm"
                  >
                    <span>
                      {item.name} ×{" "}
                      {item.quantity}
                    </span>

                    <span className="font-medium">
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}{" "}
                      EGP
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                
                {/* Address */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </p>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {o.address || "No address"}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() =>
                    handleDeleteOrder(
                      o.id || o._id
                    )
                  }
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 hover:text-red-700 px-4 py-2 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                {/* Total + Status */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </p>

                    <p className="text-xl font-bold text-orange-500">
                      {o.totalPrice?.toFixed(2)} EGP
                    </p>
                  </div>

                  <select
                    value={o.status}
                    disabled={
                      savingOrderId === o.id ||
                      savingOrderId === o._id
                    }
                    onChange={(e) =>
                      changeStatus(
                        o.id || o._id,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg px-3 py-2 text-sm transition-colors duration-300"
                  >
                    <option value="CONFIRMED">
                      CONFIRMED
                    </option>

                    <option value="PREPARING">
                      PREPARING
                    </option>

                    <option value="OUT_FOR_DELIVERY">
                      OUT_FOR_DELIVERY
                    </option>

                    <option value="DELIVERED">
                      DELIVERED
                    </option>

                    <option value="CANCELLED">
                      CANCELLED
                    </option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}