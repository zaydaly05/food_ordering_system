import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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

import { useOrders } from "../../../models/context/OrdersContext.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { getAllOrders } = useOrders();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadOrders = async () => {
    try {
      setLoading(true);

      const cached = localStorage.getItem("dashboard_orders");

      if (cached) {
        setOrders(JSON.parse(cached));
      }

      const dbOrders = await getAllOrders();

      setOrders(dbOrders || []);

      localStorage.setItem(
        "dashboard_orders",
        JSON.stringify(dbOrders || [])
      );
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  loadOrders();
}, []);

 
  const dashboardData = useMemo(() => {
    const counts = {};
    const revenuePerDay = {};
    const orderCountPerDay = {};

    const days = 7;
    const labels = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const label = d.toLocaleDateString();

      labels.push(label);

      revenuePerDay[label] = 0;
      orderCountPerDay[label] = 0;
    }

    orders.forEach((o) => {
      // PRODUCTS
      (o.items || []).forEach((it) => {
        counts[it.name] = (counts[it.name] || 0) + it.quantity;
      });

      // DATES
      if (o.createdAt) {
        const label = new Date(o.createdAt).toLocaleDateString();

        if (revenuePerDay[label] !== undefined) {
          revenuePerDay[label] += Number(o.totalPrice || 0);
          orderCountPerDay[label] += 1;
        }
      }
    });

    const foods = Object.keys(counts)
      .map((k) => ({
        name: k,
        count: counts[k],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      labels,
      revenueData: labels.map((l) => revenuePerDay[l]),
      orderCounts: labels.map((l) => orderCountPerDay[l]),
      foods,
    };
  }, [orders]);

  const revenueChart = {
    labels: dashboardData.labels,
    datasets: [
      {
        label: "Revenue",
        data: dashboardData.revenueData,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.12)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const ordersChart = {
    labels: dashboardData.labels,
    datasets: [
      {
        label: "Orders",
        data: dashboardData.orderCounts,
        backgroundColor: "#6366f1",
      },
    ],
  };

  const topChart = {
    labels: dashboardData.foods.map((f) => f.name),
    datasets: [
      {
        data: dashboardData.foods.map((f) => f.count),
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#06b6d4",
        ],
      },
    ],
  };

  const totalRevenue = dashboardData.revenueData.reduce(
    (s, v) => s + v,
    0
  );

  const totalOrders = orders.length;

  const totalProducts = new Set(
    orders.flatMap((o) => (o.items || []).map((i) => i.name))
  ).size;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded shadow"
        >
          <div className="text-sm text-gray-500">
            Total Revenue (7d)
          </div>

          <div className="text-2xl font-bold text-orange-500">
            {totalRevenue.toFixed(2)} EGP
          </div>

          <div className="text-sm text-gray-500 mt-2">
            {totalOrders} orders
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded shadow"
        >
          <div className="text-sm text-gray-500">Total Orders</div>

          <div className="text-2xl font-bold">{totalOrders}</div>

          <div className="text-sm text-gray-500 mt-2">
            Products sold: {totalProducts}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded shadow"
        >
          <div className="text-sm text-gray-500">Products</div>

          <div className="text-2xl font-bold">{totalProducts}</div>

          <div className="text-sm text-gray-500 mt-2">
            Top items below
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">
            Revenue (last 7 days)
          </h3>

          <Line data={revenueChart} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">
            Orders & Top Products
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Bar data={ordersChart} />

            <div className="flex items-center justify-center">
              {dashboardData.foods.length ? (
                <Pie data={topChart} />
              ) : (
                <div className="text-gray-500">
                  No product data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}