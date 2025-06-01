import { Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import ProfileSetup from "../components/expert/ProfileSetup";
import StudentProfileSetup from "../components/student/ProfileSetup";
import { ROUTE_PATHS } from "../types/routes";

export function useProfileSetupRoutes() {
  const { profileStatus, updateProfileStatus } = useAuth();

  return [
    // Staff Profile Setup
    <Route
      key="staff-profile-setup"
      path={ROUTE_PATHS.STAFF_PROFILE_SETUP}
      element={
        <ProtectedRoute allowedRoles={["staff"]}>
          <ProfileSetup
            onComplete={() => {
              updateProfileStatus({ isComplete: true, missingFields: [] });
            }}
            profileStatus={
              profileStatus || { isComplete: false, missingFields: [] }
            }
          />
        </ProtectedRoute>
      }
    />,

    // Student Profile Setup
    <Route
      key="student-profile-setup"
      path={ROUTE_PATHS.STUDENT_PROFILE_SETUP}
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentProfileSetup
            onComplete={() => {
              updateProfileStatus({ isComplete: true, missingFields: [] });
            }}
            profileStatus={
              profileStatus || { isComplete: false, missingFields: [] }
            }
          />
        </ProtectedRoute>
      }
    />,
  ];
}
