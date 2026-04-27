import { foods as defaultFoods } from "../../../models/data/foods";
import { motion } from "framer-motion";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useEffect, useState } from "react";
import ProductEditModal from "../../components/ProductEditModal";

export default function Products() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("admin_foods") || "null");
    if (saved && Array.isArray(saved)) {
      setItems(saved);
    } else {
      setItems(defaultFoods);
    }
  }, []);

  function openEdit(p) {
    setEditing(p);
  }

  function handleSave(updated) {
    const next = items.map((it) => (String(it.id) === String(updated.id) ? updated : it));
    setItems(next);
    localStorage.setItem("admin_foods", JSON.stringify(next));
    setEditing(null);
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -4 }} className="bg-white rounded shadow p-4">
            <ImageWithFallback src={p.image} alt={p.name} className="h-36 w-full object-cover rounded" />
            <div className="mt-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">${p.price}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-sm px-3 py-1 border rounded bg-white hover:bg-slate-50">Edit</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editing && (
        <ProductEditModal product={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}