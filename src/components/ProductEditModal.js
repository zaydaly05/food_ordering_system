import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductEditModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({ ...product });

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Name
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="text-sm">Price
            <input type="number" value={form.price} onChange={(e) => updateField('price', Number(e.target.value))} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="text-sm">Image URL
            <input value={form.image} onChange={(e) => updateField('image', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="text-sm">Category
            <input value={form.category} onChange={(e) => updateField('category', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </label>

          <label className="text-sm">Description
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={3} />
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={() => onSave(form)} className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
