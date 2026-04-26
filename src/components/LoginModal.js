import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginModal() {
  const { login, signup, closeLogin, loginMode, showLogin } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' or 'signup'

  useEffect(() => {
    if (showLogin) setMode(loginMode || "login");
  }, [showLogin, loginMode]);

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Logged in");
      closeLogin();
    } catch (err) {
      toast.error("Login failed. Please check backend and MongoDB.");
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password, phone, address });
      toast.success("Account created and signed in");
      closeLogin();
    } catch (err) {
      toast.error("Signup failed. Please check backend and MongoDB.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeLogin} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <button className="absolute right-3 top-3 text-gray-500" onClick={closeLogin}>✕</button>

        {mode === "login" ? (
          <>
            <h2 className="text-xl font-bold mb-4">Sign in</h2>

            <form onSubmit={submitLogin} className="flex flex-col gap-3">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border p-2" />

              <button className="bg-orange-500 text-white py-2 rounded">Sign in</button>
            </form>
            <p className="mt-3 text-xs text-gray-500">
              Demo emails: <span className="font-medium">admin@foodapp.demo</span> or <span className="font-medium">customer@foodapp.demo</span>
            </p>

            <div className="mt-3 text-sm">
              <span>Don't have an account? </span>
              <button className="text-orange-500" onClick={() => setMode("signup")}>Create one</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Create Account</h2>
            <p className="text-sm text-gray-600 mb-2">New accounts are created as Customer users.</p>

            <form onSubmit={submitSignup} className="flex flex-col gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border p-2" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border p-2" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="border p-2" />

              <button className="bg-orange-500 text-white py-2 rounded">Sign up</button>
            </form>

            <div className="mt-3 text-sm">
              <span>Already have an account? </span>
              <button className="text-orange-500" onClick={() => setMode("login")}>Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
