import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { isLoggedIn, openLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) openLogin();
  }, [isLoggedIn, openLogin]);

  if (isLoggedIn) return children;

  // redirect to menu preview when not logged in
  return <Navigate to="/menu" state={{ from: location }} replace />;
}
