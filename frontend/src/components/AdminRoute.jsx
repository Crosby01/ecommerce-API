import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function isAdminToken(token) {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return false;
    }

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));

    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

function AdminRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdminToken(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;