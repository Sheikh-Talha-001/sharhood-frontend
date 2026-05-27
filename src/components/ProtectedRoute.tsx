import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;

  // Not logged in -> Redirect to login, saving where they tried to go
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Suspended user -> Redirect to the suspension appeal page
  if (user.isSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  return <Outlet />;
}
