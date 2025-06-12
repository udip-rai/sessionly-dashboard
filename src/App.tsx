import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ExpertDashboard } from "./components/dashboard/ExpertDashboard";
import { Availability } from "./components/expert/Availability";
import { Payments } from "./components/expert/Payments";
import LoginPage from "./pages/login";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ExpertManagement } from "./components/admin/ExpertManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { CategoryManagement } from "./components/admin/CategoryManagement";
import { ContentManagement } from "./components/admin/content/ContentManagement";
import { BookingManagement } from "./components/admin/BookingManagement";
import { MessageManagement } from "./components/admin/MessageManagement";
import { PaymentManagement } from "./components/admin/PaymentManagement";
import ExpertSignup from "./pages/expert-signup";
import StudentSignup from "./pages/student-signup";
import ProfileSetup from "./components/expert/ProfileSetup";
import StudentProfileSetup from "./components/student/ProfileSetup";
import { StudentProfileManager } from "./components/student/ProfileManager";
import ExpertProfileManager from "./components/expert/ProfileManager";

function App() {
  const { isAuthenticated, userRole, profileStatus, updateProfileStatus } =
    useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated && userRole ? (
            <Navigate to={`/${userRole}-dashboard`} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/signup/student" element={<StudentSignup />} />
      <Route path="/signup/staff" element={<ExpertSignup />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/experts"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <ExpertManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <CategoryManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/content"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <ContentManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/bookings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <BookingManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/messages"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <MessageManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/payments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <PaymentManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Staff Routes */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <Layout>
              <ExpertDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-dashboard/availability"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <Layout>
              <Availability />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-dashboard/payments"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <Layout>
              <Payments />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Staff Profile */}
      <Route
        path="/staff-dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <Layout>
              <ExpertProfileManager />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Staff Profile Setup */}
      <Route
        path="/staff-dashboard/profile-setup"
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
      />

      {/* Protected Student Routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Profile Management */}
      <Route
        path="/student-dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <StudentProfileManager />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Profile Setup */}
      <Route
        path="/student-dashboard/profile-setup"
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
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Wrap the app with necessary providers
function AppWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
          <Toaster
            gutter={8}
            containerStyle={{
              top: 20,
            }}
            toastOptions={{
              duration: 4000,
              position: "top-right",
            }}
          />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default AppWrapper;
