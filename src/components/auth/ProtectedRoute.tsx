import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "staff" | "student")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || !userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has permission
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  // Return the protected content
  return <>{children}</>;
}
