import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export function AdminProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
