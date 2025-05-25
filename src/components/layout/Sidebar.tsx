import {
  FiCalendar,
  FiUsers,
  FiLogOut,
  FiFileText,
  FiShield,
  FiBook,
  FiClock,
  FiDollarSign,
  FiUser,
  FiAlertCircle,
  FiList,
  FiLayout,
  FiMail,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "../../types/navigation";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isExpertDashboard = currentPath.startsWith("/expert-dashboard");
  const isAdminDashboard = currentPath.startsWith("/admin-dashboard");

  const expertNavItems: NavItem[] = [
    { name: "Your Bookings", icon: FiCalendar, path: "/expert-dashboard" },
    {
      name: "Availability",
      icon: FiClock,
      path: "/expert-dashboard/availability",
    },
    {
      name: "Payments",
      icon: FiDollarSign,
      path: "/expert-dashboard/payments",
    },
    {
      name: "Your Profile",
      icon: FiUser,
      path: "/expert-dashboard/profile",
      alert: true,
    },
  ];

  const studentNavItems: NavItem[] = [
    { name: "Your Bookings", icon: FiCalendar, path: "/student-dashboard" },
    { name: "Browse Experts", icon: FiUsers, path: "/browse-experts" },
  ];

  const adminNavItems: NavItem[] = [
    { name: "Dashboard Overview", icon: FiLayout, path: "/admin-dashboard" },
    {
      name: "Expert Applications",
      icon: FiUser,
      path: "/admin-dashboard/experts",
    },
    { name: "User Management", icon: FiUsers, path: "/admin-dashboard/users" },
    {
      name: "Expert Categories",
      icon: FiList,
      path: "/admin-dashboard/categories",
    },
    {
      name: "Content Management",
      icon: FiFileText,
      path: "/admin-dashboard/content",
    },
    {
      name: "All Bookings",
      icon: FiCalendar,
      path: "/admin-dashboard/bookings",
    },
    { name: "Message Center", icon: FiMail, path: "/admin-dashboard/messages" },
    {
      name: "Payment Management",
      icon: FiDollarSign,
      path: "/admin-dashboard/payments",
    },
  ];

  // Only show policy items for student dashboard
  const policyItems =
    isExpertDashboard || isAdminDashboard
      ? []
      : [
          {
            name: "Terms of Use",
            icon: FiFileText,
            path: "/student-dashboard/terms-of-use",
          },
          {
            name: "Booking Policy",
            icon: FiBook,
            path: "/student-dashboard/booking-policy",
          },
          {
            name: "Privacy Policy",
            icon: FiShield,
            path: "/student-dashboard/privacy-policy",
          },
        ];

  const navItems = isAdminDashboard
    ? adminNavItems
    : isExpertDashboard
    ? expertNavItems
    : studentNavItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col h-[calc(100vh-64px)]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center text-white text-sm font-medium shadow-md">
            MM
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900">
              Milan Mahat
            </span>
            <p className="text-xs text-gray-500">
              {isAdminDashboard
                ? "Super Admin"
                : isExpertDashboard
                ? "Expert"
                : "Student"}
            </p>
          </div>
        </div>
      </div>

      <nav className="p-6 flex-1">
        <div className="space-y-1 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  currentPath === item.path
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                }
              `}
            >
              <div className="flex items-center">
                <item.icon
                  className={`
                    mr-3 h-5 w-5
                    ${
                      currentPath === item.path
                        ? "text-white"
                        : "text-gray-400 group-hover:text-navy"
                    }
                  `}
                />
                {item.name}
              </div>
              {"alert" in item && item.alert && (
                <FiAlertCircle
                  className={`
                  h-5 w-5 text-red-500
                  ${currentPath === item.path ? "text-white" : "text-red-500"}
                `}
                />
              )}
            </Link>
          ))}
        </div>

        {policyItems.length > 0 && (
          <div className="space-y-1">
            {policyItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200
                  ${
                    currentPath === item.path
                      ? "text-navy font-medium bg-navy/10 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                  }
                `}
              >
                <item.icon
                  className={`
                  mr-3 h-5 w-5
                  ${
                    currentPath === item.path
                      ? "text-navy"
                      : "text-gray-400 group-hover:text-navy"
                  }
                `}
                />
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-all duration-200">
          <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
