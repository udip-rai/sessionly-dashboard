import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "expert" | "student")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required for this route
  if (allowedRoles && allowedRoles.length > 0) {
    // If user doesn't have a role yet or their role isn't in the allowed list
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to the appropriate dashboard based on role
      switch (userRole) {
        case "admin":
          return <Navigate to="/admin-dashboard" replace />;
        case "expert":
          return <Navigate to="/expert-dashboard" replace />;
        case "student":
          return <Navigate to="/student-dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
}
