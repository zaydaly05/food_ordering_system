import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [foodsCount, setFoodsCount] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("demo_orders") || "[]");
    setOrders(saved.reverse());

    // compute top products
    const counts = {};
    saved.forEach((o) => {
      (o.items || []).forEach((it) => {
        counts[it.name] = (counts[it.name] || 0) + 1;
      });
    });
    const arr = Object.keys(counts).map((k) => ({ name: k, count: counts[k] }));
    arr.sort((a, b) => b.count - a.count);
    setFoodsCount(arr.slice(0, 6));
  }, []);

  // prepare revenue over last 7 days using order id timestamps
  const days = 7;
  const dayLabels = [];
  const revenueData = [];
  const orderCounts = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString();
    dayLabels.push(label);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const end = start + 24 * 60 * 60 * 1000;
    const dayOrders = orders.filter((o) => o.id >= start && o.id < end);
    const revenue = dayOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    revenueData.push(revenue);
    orderCounts.push(dayOrders.length);
  }

  const revenueChart = {
    labels: dayLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.12)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const ordersChart = {
    labels: dayLabels,
    datasets: [
      {
        label: "Orders",
        data: orderCounts,
        backgroundColor: "#6366f1",
      },
    ],
  };

  const topLabels = foodsCount.map((f) => f.name);
  const topValues = foodsCount.map((f) => f.count);
  const topChart = {
    labels: topLabels,
    datasets: [
      {
        data: topValues,
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#06b6d4"],
      },
    ],
  };

  const totalRevenue = revenueData.reduce((s, v) => s + v, 0);
  const totalOrders = orders.length;
  const totalProducts = new Set((orders.flatMap(o => (o.items || []).map(i => i.name)))).size || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded shadow flex flex-col">
          <div className="text-sm text-gray-500">Total Revenue (7d)</div>
          <div className="text-2xl font-bold text-orange-500">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-2">{totalOrders} orders</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded shadow flex flex-col">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <div className="text-sm text-gray-500 mt-2">Products sold: {totalProducts}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded shadow flex flex-col">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <div className="text-sm text-gray-500 mt-2">Top items below</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Revenue (last 7 days)</h3>
          <Line data={revenueChart} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Orders & Top Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Bar data={ordersChart} />
            </div>
            <div className="flex items-center justify-center">
              {topValues.length ? <Pie data={topChart} /> : <div className="text-gray-500">No product data yet</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        {orders.length === 0 ? (
          <div className="text-gray-500">No orders yet.</div>
        ) : (
          <div className="grid gap-3">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-sm text-gray-500">{o.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-500">${o.total}</div>
                  <div className="text-sm text-gray-600">{o.paymentMethod} • {o.paymentStatus}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}