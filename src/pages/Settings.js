import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, updatePreferences } = useAuth();
  const prefs = user?.preferences || {};
  const isAdmin = user?.role === "ADMIN";

  const [newsletter, setNewsletter] = useState(!!prefs.newsletter);
  const [defaultPayment, setDefaultPayment] = useState(prefs.defaultPayment || "instapay");
  const [theme, setTheme] = useState(prefs.theme || "light");
  const navigate = useNavigate();

  const save = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences({ newsletter, defaultPayment, theme });
      toast.success("Settings saved");
      navigate('/');
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {isAdmin ? (
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-4 text-sm">
          <p className="font-medium mb-1">Admin account</p>
          <p>Permissions: {(user?.permissions || []).join(", ") || "No permissions set"}</p>
        </div>
      ) : null}

      <form onSubmit={save} className="bg-white rounded shadow p-4 flex flex-col gap-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
          <span>Receive news & offers</span>
        </label>

        <label className="text-sm">Default payment method</label>
        <select value={defaultPayment} onChange={(e) => setDefaultPayment(e.target.value)} className="border p-2">
          <option value="instapay">Instapay</option>
          <option value="credit">Credit/Debit</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <label className="text-sm">Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border p-2">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button className="mt-2 bg-orange-500 text-white py-2 rounded">Save settings</button>
      </form>
    </motion.main>
  );
}
