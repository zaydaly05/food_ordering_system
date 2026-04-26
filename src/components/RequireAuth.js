import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children, allowedRoles }) {
  const { isLoggedIn, openLogin, user } = useAuth();
  const location = useLocation();
  const roleBlocked = Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user?.role);

  useEffect(() => {
    if (!isLoggedIn) openLogin();
  }, [isLoggedIn, openLogin]);

  if (isLoggedIn && !roleBlocked) return children;
  if (isLoggedIn && roleBlocked) {
    const fallback = user?.role === "ADMIN" ? "/admin" : "/menu";
    return <Navigate to={fallback} replace />;
  }

  // redirect to menu preview when not logged in
  return <Navigate to="/menu" state={{ from: location }} replace />;
}
