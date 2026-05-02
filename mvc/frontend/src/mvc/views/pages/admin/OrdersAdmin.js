import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOrders } from "../../../models/context/OrdersContext.js";

export default function OrdersAdmin() {
  const { getAllOrders } = useOrders();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const dbOrders = await getAllOrders();
        setOrders(dbOrders);
      } catch (err) {
        toast.error("Failed to load orders");
      }
    };

    loadOrders();
  }, [getAllOrders]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500">No orders yet.</div>
      ) : (
        <div className="grid gap-5">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-lg text-gray-800">
                    Order #{o.id?.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "No date"}
                  </p>
                </div>

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
                    className="flex justify-between border-b pb-2 text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-700">
                    {o.address || "No address"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-orange-500">
                    ${o.totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
