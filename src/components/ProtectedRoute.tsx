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

  // Suspended user -> Block access to protected areas
  if (user.isSuspended) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-4xl p-8 md:p-12 shadow-xl border border-red-100 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-black mb-3">Account Suspended</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your account has been suspended by a moderator. Please check your email for details or contact support to appeal.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-brand-black rounded-full py-4 font-bold hover:bg-gray-200 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
