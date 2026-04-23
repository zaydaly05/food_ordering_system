import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USER_KEY = "demo_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState("login");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persistUser = (u) => {
    setUser(u);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch (e) {}
  };

  const login = ({ email }) => {
    // demo login: restore existing user or create minimal profile
    let u = { email };
    try {
      const saved = JSON.parse(localStorage.getItem(USER_KEY) || "null");
      if (saved && saved.email === email) u = saved;
    } catch (e) {}
    persistUser({
      ...{
        name: email.split("@")[0],
        phone: "",
        address: "",
        preferences: { newsletter: true, defaultPayment: "instapay", theme: "light" },
      },
      ...u,
    });
  };

  const signup = ({ name, email, phone, address }) => {
    const newUser = {
      name: name || (email ? email.split("@")[0] : "user"),
      email: email || "user@demo",
      phone: phone || "",
      address: address || "",
      preferences: { newsletter: true, defaultPayment: "instapay", theme: "light" },
    };
    persistUser(newUser);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  };

  const updateProfile = (updates) => {
    const next = { ...user, ...updates };
    persistUser(next);
  };

  const updatePreferences = (prefs) => {
    const next = { ...user, preferences: { ...(user?.preferences || {}), ...prefs } };
    persistUser(next);
  };

  const openLogin = (mode = "login") => { setLoginMode(mode); setShowLogin(true); };
  const closeLogin = () => setShowLogin(false);

  // apply theme (dark/class) to document root when preferences change
  useEffect(() => {
    try {
      const theme = user?.preferences?.theme || "light";
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (e) {}
  }, [user?.preferences?.theme]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, updatePreferences, isLoggedIn: !!user, showLogin, loginMode, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
