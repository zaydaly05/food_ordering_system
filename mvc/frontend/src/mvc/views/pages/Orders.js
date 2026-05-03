import { useEffect, useState } from "react";
import { useOrders } from "../../models/context/OrdersContext";
import { useAuth } from "../../models/context/AuthContext"; // adjust path if needed

export default function Orders() {
  const { getUserOrders } = useOrders();
  const { user, isAuthReady } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("USER ID:", user?.id);

        const data = await getUserOrders(user.id);
        console.log("ORDERS:", data);

        setOrders(data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    };

    if (!isAuthReady) return;
    if (!user?.id) return;

    fetchOrders();
  }, [isAuthReady, user?.id, getUserOrders]);


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
									${o.totalPrice}
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
									<span>${it.price}</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
