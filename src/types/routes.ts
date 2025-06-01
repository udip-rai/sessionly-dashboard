export type UserRole = "admin" | "staff" | "student";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
}

export interface PublicRouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  redirectIfAuthenticated?: boolean;
}

// Route path constants for type safety
export const ROUTE_PATHS = {
  // Auth routes
  LOGIN: "/login",
  SIGNUP_STUDENT: "/signup/student",
  SIGNUP_STAFF: "/signup/staff",

  // Profile setup routes
  STAFF_PROFILE_SETUP: "/staff/profile-setup",
  STUDENT_PROFILE_SETUP: "/student/profile-setup",

  // Admin routes
  ADMIN_DASHBOARD: "/admin-dashboard",
  ADMIN_EXPERTS: "/admin-dashboard/experts",
  ADMIN_USERS: "/admin-dashboard/users",
  ADMIN_CATEGORIES: "/admin-dashboard/categories",
  ADMIN_CONTENT: "/admin-dashboard/content",
  ADMIN_BOOKINGS: "/admin-dashboard/bookings",
  ADMIN_MESSAGES: "/admin-dashboard/messages",
  ADMIN_PAYMENTS: "/admin-dashboard/payments",

  // Staff routes
  STAFF_DASHBOARD: "/staff-dashboard",
  STAFF_AVAILABILITY: "/staff-dashboard/availability",
  STAFF_PAYMENTS: "/staff-dashboard/payments",
  STAFF_PROFILE: "/staff-dashboard/profile",

  // Student routes
  STUDENT_DASHBOARD: "/student-dashboard",
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
