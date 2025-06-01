import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Layout } from "../layout/Layout";
import { Dashboard } from "../dashboard/Dashboard";
import { StudentProfileManager } from "../student/ProfileManager";
import NotFoundPage from "../ui/NotFoundPage";

/**
 * Unified routing component that ensures all routes work correctly
 * regardless of whether they're defined in App.tsx or routeConfig.ts
 */
export const UnifiedRouter: React.FC = () => {
  const { userRole } = useAuth();
  const location = useLocation();

  // Log all navigation attempts for debugging
  useEffect(() => {
    console.log("[UnifiedRouter] Route changed:", location.pathname);
    console.log("[UnifiedRouter] User role:", userRole);
  }, [location.pathname, userRole]);

  // Handle critical route redirects
  const isStudentProfilePath =
    location.pathname === "/student-dashboard/profile";

  if (isStudentProfilePath && userRole === "student") {
    return (
      <Layout>
        <StudentProfileManager />
      </Layout>
    );
  }

  // Fixed Dashboard route
  const isStudentDashPath = location.pathname === "/student-dashboard";

  if (isStudentDashPath && userRole === "student") {
    return (
      <Layout>
        <Dashboard />
      </Layout>
    );
  }
  // If we get here, the route wasn't handled by App.tsx routes or by specific handlers above
  // So we show the 404 Not Found page
  console.log("[UnifiedRouter] No route found, showing 404 page");
  return <NotFoundPage />;
};

export default UnifiedRouter;
