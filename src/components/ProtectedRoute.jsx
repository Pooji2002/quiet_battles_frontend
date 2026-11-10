
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("qbAccessToken");

  const user = JSON.parse(
    localStorage.getItem("qbUser") || "null"
  );

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
