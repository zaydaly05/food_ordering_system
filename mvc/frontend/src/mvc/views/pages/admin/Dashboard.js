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

const MAX_PIE_SLICES = 10;

const BASE_SLICE_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#a855f7",
];

/**
 * Integer percentages that always sum to 100 (largest remainder method).
 * Avoids per-slice Math.round() showing 33% + 33% + 33% = 99%.
 */
function largestRemainderPercents(shares) {
  const total = shares.reduce((s, n) => s + (Number(n) || 0), 0);
  if (!total) return shares.map(() => 0);

  const raw = shares.map((v) => (((Number(v) || 0) / total) * 100));
  const floors = raw.map((p) => Math.floor(p));
  let rem = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((p, i) => ({ i, frac: p - Math.floor(p) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < rem; k++) {
    out[order[k].i]++;
  }
  return out;
}

function sliceBackgroundColors(n) {
  if (n <= BASE_SLICE_COLORS.length) {
    return BASE_SLICE_COLORS.slice(0, n);
  }
  const out = BASE_SLICE_COLORS.slice();
  for (let i = out.length; i < n; i++) {
    const hue = ((i - BASE_SLICE_COLORS.length) * 47 + 12) % 360;
    out.push(`hsl(${hue}, 62%, 52%)`);
  }
  return out;
}

/** Draws share of total on each pie slice (Chart.js has no built-in slice labels). */
const piePercentageLabelsPlugin = {
  id: "piePercentageLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length || meta.hidden) return;

    const values = chart.data.datasets[0].data.map((n) => Number(n) || 0);
    const total = values.reduce((sum, n) => sum + n, 0);
    if (!total) return;

    const percents = largestRemainderPercents(values);

    const fontSize = Math.min(
      13,
      Math.max(10, Math.round(chart.width / 26))
    );

    ctx.save();
    ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    meta.data.forEach((arc, i) => {
      const label = `${percents[i]}%`;

      const { x, y } = arc.tooltipPosition();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,255,255,0.92)";
      ctx.strokeText(label, x, y);
      ctx.fillStyle = "#111827";
      ctx.fillText(label, x, y);
    });

    ctx.restore();
  },
};

function pieSliceValue(context) {
  const parsed = context.parsed;
  if (typeof parsed === "number") return parsed;
  if (parsed && typeof parsed === "object" && "y" in parsed) {
    return Number(parsed.y) || 0;
  }
  return Number(context.raw) || 0;
}

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
}, [getAllOrders]);

 
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

    const sortedFoods = Object.keys(counts)
      .map((k) => ({
        name: k,
        count: counts[k],
      }))
      .sort((a, b) => b.count - a.count);

    let foods;
    if (sortedFoods.length <= MAX_PIE_SLICES) {
      foods = sortedFoods;
    } else {
      const head = sortedFoods.slice(0, MAX_PIE_SLICES - 1);
      const tail = sortedFoods.slice(MAX_PIE_SLICES - 1);
      const otherCount = tail.reduce((s, row) => s + row.count, 0);
      foods = [...head, { name: "Other", count: otherCount }];
    }

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

  const topChart = useMemo(() => {
    const foods = dashboardData.foods;
    const n = foods.length;
    return {
      labels: foods.map((f) => f.name),
      datasets: [
        {
          data: foods.map((f) => f.count),
          backgroundColor: sliceBackgroundColors(n),
        },
      ],
    };
  }, [dashboardData.foods]);

  const ordersBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const topProductsPieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label(context) {
            const name = context.label ?? "";
            const value = pieSliceValue(context);
            const data = context.chart.data.datasets[0].data.map(
              (n) => Number(n) || 0
            );
            const percents = largestRemainderPercents(data);
            const idx = context.dataIndex;
            const pct = percents[idx] ?? 0;
            return `${name}: ${value} units (${pct}%)`;
          },
        },
      },
    },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="relative h-72 w-full min-w-0">
              <Bar data={ordersChart} options={ordersBarOptions} />
            </div>

            <div className="relative w-full min-w-0 min-h-[260px] flex items-center justify-center">
              {dashboardData.foods.length ? (
                <div className="h-72 w-full max-w-sm">
                  <Pie
                    data={topChart}
                    options={topProductsPieOptions}
                    plugins={[piePercentageLabelsPlugin]}
                  />
                </div>
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