import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USER_KEY = "demo_user";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
export const USER_ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
};

const DEMO_ADMIN = {
  id: "admin-1",
  name: "System Admin",
  email: "admin@foodapp.demo",
  role: USER_ROLES.ADMIN,
  permissions: ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "VIEW_REPORTS"],
  preferences: { newsletter: false, defaultPayment: "instapay", theme: "light" },
};

const DEMO_CUSTOMER = {
  id: "customer-1",
  name: "Demo Customer",
  email: "customer@foodapp.demo",
  role: USER_ROLES.CUSTOMER,
  phone: "",
  address: "",
  loyaltyPoints: 0,
  preferences: { newsletter: true, defaultPayment: "instapay", theme: "light" },
};

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

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    const backendUser = await response.json();
    const inferredRole = backendUser?.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.CUSTOMER;
    const roleDefaults = inferredRole === USER_ROLES.ADMIN ? DEMO_ADMIN : DEMO_CUSTOMER;
    persistUser({ ...roleDefaults, ...backendUser });
  };

  const signup = async ({ name, email, password, phone, address }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, address }),
    });
    if (!response.ok) throw new Error("Signup failed");
    const backendUser = await response.json();
    persistUser({ ...DEMO_CUSTOMER, ...backendUser, role: USER_ROLES.CUSTOMER });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  };

  const updateProfile = async (updates) => {
    if (!user?.id) {
      const next = { ...user, ...updates };
      persistUser(next);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/users/${user.id}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Profile update failed");
    const backendUser = await response.json();
    persistUser({ ...user, ...backendUser });
  };

  const updatePreferences = async (prefs) => {
    if (!user?.id) {
      const next = { ...user, preferences: { ...(user?.preferences || {}), ...prefs } };
      persistUser(next);
      return;
    }
    const response = await fetch(`${API_BASE_URL}/users/${user.id}/preferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    if (!response.ok) throw new Error("Preferences update failed");
    const backendUser = await response.json();
    persistUser({ ...user, ...backendUser });
  };

  const openLogin = (mode = "login") => { setLoginMode(mode); setShowLogin(true); };
  const closeLogin = () => setShowLogin(false);
  const hasRole = (role) => user?.role === role;

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
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, updatePreferences, isLoggedIn: !!user, hasRole, showLogin, loginMode, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
