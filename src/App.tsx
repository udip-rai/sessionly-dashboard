import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ExpertDashboard } from "./components/dashboard/ExpertDashboard";
import { Availability } from "./components/expert/Availability";
import { Payments } from "./components/expert/Payments";
import { Profile } from "./components/expert/Profile";
import { PolicyPage } from "./components/policy/PolicyPage";
import LoginPage from "./pages/login";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ExpertManagement } from "./components/admin/ExpertManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { CategoryManagement } from "./components/admin/CategoryManagement";
import { ContentManagement } from "./components/admin/ContentManagement";
import { BookingManagement } from "./components/admin/BookingManagement";
import { MessageManagement } from "./components/admin/MessageManagement";
import { PaymentManagement } from "./components/admin/PaymentManagement";
import ExpertSignup from "./pages/expert-signup";
import StudentSignup from "./pages/student-signup";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/admin-dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/signup/student" element={<StudentSignup />} />
      <Route path="/signup/expert" element={<ExpertSignup />} />

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

      {/* Protected Expert Routes */}
      <Route
        path="/expert-dashboard"
        element={
          <ProtectedRoute allowedRoles={["expert"]}>
            <Layout>
              <ExpertDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert-dashboard/availability"
        element={
          <ProtectedRoute allowedRoles={["expert"]}>
            <Layout>
              <Availability />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert-dashboard/payments"
        element={
          <ProtectedRoute allowedRoles={["expert"]}>
            <Layout>
              <Payments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert-dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={["expert"]}>
            <Layout>
              <Profile />
            </Layout>
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

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Wrap the app with necessary providers
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;
