import { useState } from "react";
import { useAuth } from "../../models/context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const save = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, address });
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <form onSubmit={save} className="bg-white rounded shadow p-4 flex flex-col gap-3">
        <label className="text-sm">User ID</label>
        <input value={user?.id || ""} disabled className="border p-2 bg-gray-100" />

        <label className="text-sm">Role</label>
        <input value={user?.role || ""} disabled className="border p-2 bg-gray-100" />

        <label className="text-sm">Email</label>
        <input value={user?.email || ""} disabled className="border p-2 bg-gray-100" />

        <label className="text-sm">Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />

        <label className="text-sm">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2" />

        <label className="text-sm">Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2" />

        <label className="text-sm">Loyalty points</label>
        <input value={user?.loyaltyPoints ?? 0} disabled className="border p-2 bg-gray-100" />

        <button className="mt-2 bg-orange-500 text-white py-2 rounded">Save profile</button>
      </form>
    </motion.main>
  );
}
