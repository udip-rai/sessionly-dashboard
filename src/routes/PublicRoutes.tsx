import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/login";
import ExpertSignup from "../pages/expert-signup";
import StudentSignup from "../pages/student-signup";
import { ROUTE_PATHS } from "../types/routes";

export function usePublicRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  // Helper function to redirect authenticated users
  const redirectIfAuthenticated = (component: React.ReactElement) => {
    return isAuthenticated && userRole ? (
      <Navigate to={`/${userRole}-dashboard`} replace />
    ) : (
      component
    );
  };

  return [
    <Route
      key="login"
      path={ROUTE_PATHS.LOGIN}
      element={redirectIfAuthenticated(<LoginPage />)}
    />,
    <Route
      key="signup-student"
      path={ROUTE_PATHS.SIGNUP_STUDENT}
      element={redirectIfAuthenticated(<StudentSignup />)}
    />,
    <Route
      key="signup-staff"
      path={ROUTE_PATHS.SIGNUP_STAFF}
      element={redirectIfAuthenticated(<ExpertSignup />)}
    />,
  ];
}
