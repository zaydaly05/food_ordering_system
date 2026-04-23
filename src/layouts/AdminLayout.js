import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/admin" className="px-3 py-2 rounded hover:bg-slate-800">Dashboard</Link>
          <Link to="/admin/products" className="px-3 py-2 rounded hover:bg-slate-800">Products</Link>
          <Link to="/admin/orders" className="px-3 py-2 rounded hover:bg-slate-800">Orders</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}