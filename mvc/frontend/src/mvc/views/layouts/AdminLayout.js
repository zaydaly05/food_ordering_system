import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR (fixed height, no scroll) */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/admin" className="px-3 py-2 rounded hover:bg-slate-800">Dashboard</Link>
          <Link to="/admin/products" className="px-3 py-2 rounded hover:bg-slate-800">Products</Link>
          <Link to="/admin/orders" className="px-3 py-2 rounded hover:bg-slate-800">Orders</Link>
          <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-slate-800">Users</Link>
          <Link
  to="/admin/restaurants"
  className="px-3 py-2 rounded hover:bg-slate-800"
>
  Restaurants
</Link>
  <Link
    to="/admin/menuitems"
    className="px-3 py-2 rounded hover:bg-slate-800"
  >
    Menu Items
  </Link>
  <Link
    to="/admin/payments"
    className="px-3 py-2 rounded hover:bg-slate-800"
  >
    Payments
  </Link>
  <Link
    to="/admin/deliveries"
    className="px-3 py-2 rounded hover:bg-slate-800"
  >
    Deliveries
  </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}