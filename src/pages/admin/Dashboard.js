import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 12, revenue: 1245, products: 34 });

  useEffect(() => {
    // pretend to fetch stats
    const t = setTimeout(() => setStats(s => ({ ...s, orders: s.orders + 2 })), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-2xl font-bold">{stats.orders}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">${stats.revenue}</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-2xl font-bold">{stats.products}</div>
        </motion.div>
      </div>
    </div>
  );
}