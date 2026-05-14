import { useEffect, useState } from "react";
import { useOrders } from "../../models/context/OrdersContext";
import {useCart} from "../../models/context/CartContext";
import { useAuth } from "../../models/context/AuthContext"; 

export default function Orders() {
  const { getUserOrders } = useOrders();
  const { user, isAuthReady } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);

  const handleReorder = (order) => {
  order.items.forEach((item) => {
    if (!item.productId) {
      console.error("Missing productId in order item:", item);
      return;
    }

    addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    });
  });
};

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!user?.id) return; 

      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  if (!isAuthReady) return;
  fetchOrders();
}, [isAuthReady, user?.id]);


	if (orders.length === 0) {
		return (
			<div className="p-6 max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold">Your Orders</h1>
				<p className="mt-4 text-gray-600">You have no past orders yet.</p>
			</div>
		);
	}

	return (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

    <div className="flex flex-col gap-4">

      {orders.map((o) => (
        <div key={o.id} className="p-4 border rounded bg-white">

          <div className="flex justify-between">

            <div>
              <div className="font-bold">
                Order #{o.id?.slice(-6)}
              </div>

              <div className="text-sm text-gray-500">
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString()
                  : ""}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-orange-500">
                {o.totalPrice} EGP
              </div>
              <div className="text-sm text-gray-600">
                {o.status}
              </div>
            </div>

          </div>

          <div className="mt-3 text-sm">
            {o.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{it.name}</span>
                <span>{it.price} EGP</span>
              </div>
            ))}
          </div>

        
          <button
            onClick={() => handleReorder(o)}
            className="mt-3 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
          >
            Reorder
          </button>

        </div>
      ))}

    </div>
  </div>
);
}