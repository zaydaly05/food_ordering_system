import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginModal() {
  const { login, closeLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    login({ email });
    toast.success("Logged in");
    closeLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeLogin} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <button className="absolute right-3 top-3 text-gray-500" onClick={closeLogin}>✕</button>

        <h2 className="text-xl font-bold mb-4">Sign in</h2>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border p-2" />

          <button className="bg-orange-500 text-white py-2 rounded">Sign in</button>
        </form>
      </div>
    </div>
  );
}
