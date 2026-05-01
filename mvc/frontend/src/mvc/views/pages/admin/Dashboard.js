import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
import { USER_ROLES, useAuth } from "../../../models/context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard({ view = "dashboard" }) {
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

  if (view === "users") {
    return <AdminUsersPanel />;
  }

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

function AdminUsersPanel() {
  const { user, getAllUsers, createUserByAdmin, updateUserById, deleteUserById } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: USER_ROLES.CUSTOMER,
  });

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setLoading(true);
        const dbUsers = await getAllUsers();
        if (!active) return;
        setUsers(
          dbUsers.map((u) => ({
            ...u,
            password: "",
          }))
        );
      } catch (err) {
        if (!active) return;
        toast.error("Failed to load users from database");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      active = false;
    };
  }, [getAllUsers]);

  const updateField = (targetId, key, value) => {
    setUsers((prev) =>
      prev.map((u) => (String(u.id) === String(targetId) ? { ...u, [key]: value } : u))
    );
  };

  const updateNewField = (key, value) => {
    setNewUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    try {
      setSavingUserId("new");
      const created = await createUserByAdmin({
        name: newUser.name || "",
        email: newUser.email || "",
        phone: newUser.phone || "",
        address: newUser.address || "",
        role: newUser.role || USER_ROLES.CUSTOMER,
        password: newUser.password,
      });
      setUsers((prev) => [{ ...created, password: "" }, ...prev]);
      setNewUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: USER_ROLES.CUSTOMER,
      });
      toast.success("User created");
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleSave = async (targetUser) => {
    try {
      setSavingUserId(targetUser.id);
      const payload = {
        name: targetUser.name || "",
        email: targetUser.email || "",
        phone: targetUser.phone || "",
        address: targetUser.address || "",
        role: targetUser.role || USER_ROLES.CUSTOMER,
      };

      if ((targetUser.password || "").trim()) {
        payload.password = targetUser.password.trim();
      }

      const updated = await updateUserById(targetUser.id, payload);
      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(targetUser.id)
            ? { ...updated, password: "" }
            : u
        )
      );
      toast.success("User updated");
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDelete = async (targetUser) => {
    if (String(targetUser.id) === String(user?.id)) return;
    const shouldDelete = window.confirm(`Delete user ${targetUser.email || targetUser.name}?`);
    if (!shouldDelete) return;

    try {
      setDeletingUserId(targetUser.id);
      await deleteUserById(targetUser.id);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(targetUser.id)));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <div className="bg-white rounded shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={newUser.name} onChange={(e) => updateNewField("name", e.target.value)} placeholder="Full name" className="border rounded px-3 py-2 text-sm" />
        <input value={newUser.email} onChange={(e) => updateNewField("email", e.target.value)} placeholder="Email *" className="border rounded px-3 py-2 text-sm" />
        <input value={newUser.phone} onChange={(e) => updateNewField("phone", e.target.value)} placeholder="Phone" className="border rounded px-3 py-2 text-sm" />
        <input value={newUser.address} onChange={(e) => updateNewField("address", e.target.value)} placeholder="Address" className="border rounded px-3 py-2 text-sm" />
        <input type="password" value={newUser.password} onChange={(e) => updateNewField("password", e.target.value)} placeholder="Password *" className="border rounded px-3 py-2 text-sm" />
        <div className="flex items-center gap-2">
          <select
            value={newUser.role}
            onChange={(e) => updateNewField("role", e.target.value)}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
            <option value={USER_ROLES.ADMIN}>ADMIN</option>
          </select>
          <button
            onClick={handleCreate}
            disabled={savingUserId === "new"}
            className="text-sm px-3 py-2 rounded bg-green-600 text-white disabled:bg-green-300"
          >
            {savingUserId === "new" ? "Adding..." : "Add user"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading users from database...</div>
      ) : null}

      {!loading && users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2 text-xs text-gray-500">
                ID: {u.id}
              </div>

              <input
                value={u.name || ""}
                onChange={(e) => updateField(u.id, "name", e.target.value)}
                placeholder="Name"
                className="border rounded px-3 py-2 text-sm"
              />

              <input
                value={u.email || ""}
                onChange={(e) => updateField(u.id, "email", e.target.value)}
                placeholder="Email"
                className="border rounded px-3 py-2 text-sm"
              />

              <input
                value={u.phone || ""}
                onChange={(e) => updateField(u.id, "phone", e.target.value)}
                placeholder="Phone"
                className="border rounded px-3 py-2 text-sm"
              />

              <input
                value={u.address || ""}
                onChange={(e) => updateField(u.id, "address", e.target.value)}
                placeholder="Address"
                className="border rounded px-3 py-2 text-sm"
              />

              <input
                type="password"
                value={u.password || ""}
                onChange={(e) => updateField(u.id, "password", e.target.value)}
                placeholder="New password (optional)"
                className="border rounded px-3 py-2 text-sm"
              />

              <div className="flex items-center gap-2">
                <select
                  value={u.role || USER_ROLES.CUSTOMER}
                  onChange={(e) => updateField(u.id, "role", e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
                  <option value={USER_ROLES.ADMIN}>ADMIN</option>
                </select>

                <button
                  onClick={() => handleSave(u)}
                  disabled={savingUserId === u.id}
                  className="text-sm px-3 py-1 rounded bg-orange-500 text-white disabled:bg-orange-300"
                >
                  {savingUserId === u.id ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => handleDelete(u)}
                  disabled={String(u.id) === String(user?.id) || deletingUserId === u.id}
                  className="text-sm px-3 py-1 rounded bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {deletingUserId === u.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}