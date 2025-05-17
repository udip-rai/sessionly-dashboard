import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExpertDashboard } from './components/dashboard/ExpertDashboard';
import { Availability } from './components/expert/Availability';
import { Payments } from './components/expert/Payments';
import { Profile } from './components/expert/Profile';
import { PolicyPage } from './components/policy/PolicyPage';
import LoginPage from './pages/login';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ExpertManagement } from './components/admin/ExpertManagement';
import { UserManagement } from './components/admin/UserManagement';
import { CategoryManagement } from './components/admin/CategoryManagement';
import { ContentManagement } from './components/admin/ContentManagement';
import { BookingManagement } from './components/admin/BookingManagement';
import { MessageManagement } from './components/admin/MessageManagement';
import { PaymentManagement } from './components/admin/PaymentManagement';

function App() {
  // TODO: Add authentication check here
  const isAuthenticated = true; // Temporarily set to true for development

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/student-dashboard" replace />} />
            <Route path="/student-dashboard" element={<Dashboard />} />
            <Route path="/student-dashboard/:policyType" element={<PolicyPage />} />
            
            {/* Expert routes */}
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/expert-dashboard/availability" element={<Availability />} />
            <Route path="/expert-dashboard/payments" element={<Payments />} />
            <Route path="/expert-dashboard/profile" element={<Profile />} />
            <Route path="/expert-dashboard/:policyType" element={<PolicyPage />} />

            {/* Super Admin routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/experts" element={<ExpertManagement />} />
            <Route path="/admin-dashboard/users" element={<UserManagement />} />
            <Route path="/admin-dashboard/categories" element={<CategoryManagement />} />
            <Route path="/admin-dashboard/content" element={<ContentManagement />} />
            <Route path="/admin-dashboard/bookings" element={<BookingManagement />} />
            <Route path="/admin-dashboard/messages" element={<MessageManagement />} />
            <Route path="/admin-dashboard/payments" element={<PaymentManagement />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;