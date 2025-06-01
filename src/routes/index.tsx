import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePublicRoutes } from "./PublicRoutes";
import { useAdminRoutes } from "./AdminRoutes";
import { useStaffRoutes } from "./StaffRoutes";
import { useStudentRoutes } from "./StudentRoutes";
import { useProfileSetupRoutes } from "./ProfileSetupRoutes";
import { getDefaultDashboardRoute } from "./utils";
import { ROUTE_PATHS } from "../types/routes";

export function AppRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  // Get all route arrays
  const publicRoutes = usePublicRoutes();
  const adminRoutes = useAdminRoutes();
  const staffRoutes = useStaffRoutes();
  const studentRoutes = useStudentRoutes();
  const profileSetupRoutes = useProfileSetupRoutes();

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes}

      {/* Profile Setup Routes */}
      {profileSetupRoutes}

      {/* Protected Routes */}
      {adminRoutes}
      {staffRoutes}
      {studentRoutes}

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated && userRole ? (
            <Navigate to={getDefaultDashboardRoute(userRole)} replace />
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} replace />
          )
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          isAuthenticated && userRole ? (
            <Navigate to={getDefaultDashboardRoute(userRole)} replace />
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} replace />
          )
        }
      />
    </Routes>
  );
}
