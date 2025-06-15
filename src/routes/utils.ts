import { ROUTE_PATHS, UserRole } from "../types/routes";

/**
 * Get the default dashboard route for a user role
 */
export function getDefaultDashboardRoute(userRole: UserRole): string {
  switch (userRole) {
    case "admin":
      return ROUTE_PATHS.ADMIN_DASHBOARD;
    case "staff":
      return ROUTE_PATHS.STAFF_DASHBOARD;
    case "student":
      return ROUTE_PATHS.STUDENT_DASHBOARD;
    default:
      return ROUTE_PATHS.LOGIN;
  }
}

/**
 * Get the profile setup route for a user role
 */
export function getProfileSetupRoute(userRole: UserRole): string {
  switch (userRole) {
    case "staff":
      return ROUTE_PATHS.STAFF_PROFILE_SETUP;
    case "student":
      return ROUTE_PATHS.STUDENT_PROFILE_SETUP;
    default:
      return ROUTE_PATHS.LOGIN;
  }
}

/**
 * Check if a route is a dashboard route
 */
export function isDashboardRoute(path: string): boolean {
  return [
    ROUTE_PATHS.ADMIN_DASHBOARD,
    ROUTE_PATHS.STAFF_DASHBOARD,
    ROUTE_PATHS.STUDENT_DASHBOARD,
  ].some((route) => path.startsWith(route));
}

/**
 * Check if a route is a public route (doesn't require authentication)
 */
export function isPublicRoute(path: string): boolean {
  return [
    ROUTE_PATHS.LOGIN,
    ROUTE_PATHS.SIGNUP_STUDENT,
    ROUTE_PATHS.SIGNUP_EXPERT,
  ].includes(path as any);
}
