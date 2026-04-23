import { useEffect, useState } from "react";

export default function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		// For demo we pull orders from localStorage if present
		const saved = localStorage.getItem("demo_orders");
		if (saved) setOrders(JSON.parse(saved));
	}, []);

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
				{orders.map((o, i) => (
					<div key={i} className="p-4 border rounded bg-white">
						<div className="flex justify-between">
							<div>
								<div className="font-bold">Order #{o.id}</div>
								<div className="text-sm text-gray-500">{o.date}</div>
							</div>

							<div className="text-right">
								<div className="text-right">
									<div className="font-bold text-orange-500">${o.total}</div>
									<div className="text-sm text-gray-600">{o.paymentMethod ? o.paymentMethod.toUpperCase() : "--"} • {o.paymentStatus || "--"}</div>
									<div className="text-sm text-gray-600">Subtotal: ${o.subtotal?.toFixed(2) ?? "--"}</div>
									<div className="text-sm text-gray-600">Service: ${o.serviceFee?.toFixed(2) ?? "--"}</div>
									<div className="text-sm text-gray-600">VAT: ${o.vat?.toFixed(2) ?? "--"}</div>
									{o.deliveryFee ? <div className="text-sm text-gray-600">Delivery: ${o.deliveryFee.toFixed(2)}</div> : null}
								</div>
							</div>
						</div>

						<div className="mt-3 text-sm">
							{o.items.map((it, idx) => (
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
