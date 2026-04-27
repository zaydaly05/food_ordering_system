import { useEffect, useState } from "react";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("demo_orders") || "[]");
    setOrders(saved);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500">No orders yet.</div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{o.date}</div>
                <div className="text-sm text-gray-600 mt-2">{o.items.map(it => it.name).join(", ")}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-500">${o.total}</div>
                <div className="text-sm text-gray-600">{o.paymentMethod} • {o.paymentStatus}</div>
                <div className="text-sm text-gray-600">Subtotal: ${o.subtotal?.toFixed(2) ?? "--"}</div>
                <div className="text-sm text-gray-600">Service: ${o.serviceFee?.toFixed(2) ?? "--"}</div>
                <div className="text-sm text-gray-600">VAT: ${o.vat?.toFixed(2) ?? "--"}</div>
                {o.deliveryFee ? <div className="text-sm text-gray-600">Delivery: ${o.deliveryFee.toFixed(2)}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}