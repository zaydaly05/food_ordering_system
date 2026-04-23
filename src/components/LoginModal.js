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

  const submitLogin = (e) => {
    e.preventDefault();
    login({ email });
    toast.success("Logged in");
    closeLogin();
  };

  const submitSignup = (e) => {
    e.preventDefault();
    signup({ name, email, phone, address });
    toast.success("Account created and signed in");
    closeLogin();
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

            <div className="mt-3 text-sm">
              <span>Don't have an account? </span>
              <button className="text-orange-500" onClick={() => setMode("signup")}>Create one</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Create Account</h2>

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
