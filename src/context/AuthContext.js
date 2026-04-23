import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const login = (payload) => {
    // minimal demo login - store in state
    setUser({ email: payload?.email || "user@demo" });
  };

  const logout = () => setUser(null);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, showLogin, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
