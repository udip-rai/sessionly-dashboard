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
  const { isAuthenticated, userRole, profileStatus } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } // If authenticated but no role, something is wrong - redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  // If user with incomplete profile, redirect to profile setup
  if (profileStatus && !profileStatus.isComplete) {
    if (userRole === "staff" && location.pathname !== "/staff/profile-setup") {
      return <Navigate to="/staff/profile-setup" replace />;
    }
    if (
      userRole === "student" &&
      location.pathname !== "/student/profile-setup"
    ) {
      return <Navigate to="/student/profile-setup" replace />;
    }
  }

  // If route requires specific roles and user's role isn't included
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to user's appropriate dashboard based on redirectUrl from auth response
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  return <>{children}</>;
}
