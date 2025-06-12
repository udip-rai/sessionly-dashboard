import { AdminDashboard } from "../components/admin/AdminDashboard";
import { ExpertManagement } from "../components/admin/ExpertManagement";
import { UserManagement } from "../components/admin/UserManagement";
import { CategoryManagement } from "../components/admin/CategoryManagement";
import { ContentManagement } from "../components/admin/content/ContentManagement";
import { BookingManagement } from "../components/admin/BookingManagement";
import { MessageManagement } from "../components/admin/MessageManagement";
import { PaymentManagement } from "../components/admin/PaymentManagement";
import { ExpertDashboard } from "../components/dashboard/ExpertDashboard";
import { Availability } from "../components/expert/Availability";
import { Payments } from "../components/expert/Payments";
import ExpertProfileManager from "../components/expert/ProfileManager";
import { Dashboard } from "../components/dashboard/Dashboard";
import { StudentProfileManager } from "../components/student/ProfileManager";
import BrowseExperts from "../components/student/BrowseExperts";
import { RouteConfig, ROUTE_PATHS } from "../types/routes";

export const adminRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.ADMIN_DASHBOARD,
    component: AdminDashboard,
    title: "Admin Dashboard",
    description: "Main administrative overview",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_EXPERTS,
    component: ExpertManagement,
    title: "Expert Management",
    description: "Manage expert applications and approvals",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_USERS,
    component: UserManagement,
    title: "User Management",
    description: "Manage system users and permissions",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_CATEGORIES,
    component: CategoryManagement,
    title: "Category Management",
    description: "Manage expert categories and subcategories",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_CONTENT,
    component: ContentManagement,
    title: "Content Management",
    description: "Manage platform content and resources",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_BOOKINGS,
    component: BookingManagement,
    title: "Booking Management",
    description: "Oversee all platform bookings",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_MESSAGES,
    component: MessageManagement,
    title: "Message Management",
    description: "Manage platform communications",
    allowedRoles: ["admin"],
  },
  {
    path: ROUTE_PATHS.ADMIN_PAYMENTS,
    component: PaymentManagement,
    title: "Payment Management",
    description: "Handle payments and financial transactions",
    allowedRoles: ["admin"],
  },
];

export const staffRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.STAFF_DASHBOARD,
    component: ExpertDashboard,
    title: "Expert Dashboard",
    description: "Your main dashboard overview",
    allowedRoles: ["staff"],
  },
  {
    path: ROUTE_PATHS.STAFF_AVAILABILITY,
    component: Availability,
    title: "Availability Management",
    description: "Manage your available time slots",
    allowedRoles: ["staff"],
  },
  {
    path: ROUTE_PATHS.STAFF_PAYMENTS,
    component: Payments,
    title: "Payment History",
    description: "View your earnings and payment history",
    allowedRoles: ["staff"],
  },
  {
    path: ROUTE_PATHS.STAFF_PROFILE,
    component: ExpertProfileManager,
    title: "Profile Management",
    description: "Update your expert profile",
    allowedRoles: ["staff"],
  },
];

export const studentRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.STUDENT_DASHBOARD,
    component: Dashboard,
    title: "Student Dashboard",
    description: "Your learning dashboard",
    allowedRoles: ["student"],
  },
  {
    path: ROUTE_PATHS.STUDENT_PROFILE,
    component: StudentProfileManager,
    title: "Profile Management",
    description: "Update your student profile",
    allowedRoles: ["student"],
  },
  {
    path: ROUTE_PATHS.BROWSE_EXPERTS,
    component: BrowseExperts,
    title: "Browse Experts",
    description: "Find and connect with experts",
    allowedRoles: ["student"],
  },
];
