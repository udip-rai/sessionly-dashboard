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
  FiList,
  FiLayout,
  FiMail,
  FiGrid,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { userService } from "../../api/services/user.service";
import { AnimatedCloseButton } from "../ui/AnimatedCloseButton";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isStaffDashboard = currentPath.startsWith("/staff-dashboard");
  const isAdminDashboard = currentPath.startsWith("/admin-dashboard");
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    name: string;
    userType: string;
  } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userType) return;
      try {
        const userData = await userService.getCurrentUser(user.userType);
        const displayName =
          userData?.user?.username ||
          (userData?.user?.email ? userData.user.email.split("@")[0] : "User");

        setUserData({
          name: displayName,
          userType: userData?.user?.userType,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user?.userType) {
      fetchUserData();
    }
  }, [user?.userType]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentPath]);

  const expertNavItems: NavItem[] = [
    { name: "Your Bookings", icon: FiCalendar, path: "/staff-dashboard" },
    {
      name: "Availability",
      icon: FiClock,
      path: "/staff-dashboard/availability",
    },
    {
      name: "Payments",
      icon: FiDollarSign,
      path: "/staff-dashboard/payments",
    },
    {
      name: "Your Profile",
      icon: FiUser,
      path: "/staff-dashboard/profile",
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
    isStaffDashboard || isAdminDashboard
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
    : isStaffDashboard
    ? expertNavItems
    : studentNavItems;

  // Tooltip component
  const NavTooltip = ({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) => (
    <div className="relative group/tooltip">
      {children}
      {/* Show tooltip only when sidebar is collapsed (medium to large screens but not xl+) */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-90 text-white text-xs font-medium rounded-lg px-3 py-2 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-150 ease-out whitespace-nowrap z-[9999] hidden md:block xl:hidden group-hover/tooltip:delay-150 shadow-xl border border-gray-700 backdrop-blur-sm transform scale-95 group-hover/tooltip:scale-100">
        {text}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
      </div>
    </div>
  );

  return (
    <>
      {/* Enhanced Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        {isMobileOpen ? (
          <AnimatedCloseButton
            onClick={() => setIsMobileOpen(false)}
            variant="danger"
            size="lg"
            className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg"
          />
        ) : (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
          >
            <FiGrid className="w-5 h-5 text-gray-700 group-hover:text-navy transition-colors duration-200" />
          </button>
        )}
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-72 md:w-20 lg:w-20 xl:w-72
          bg-white border-r border-gray-200/60 shadow-lg md:shadow-sm 
          flex flex-col h-screen md:h-full
          transform transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header Section */}
        <div className="p-4 md:p-3 xl:p-4 border-b border-gray-200/60 group/header relative">
          <div className="flex md:justify-center xl:justify-start items-center gap-3">
            <div className="h-10 w-10 md:h-10 md:w-10 xl:h-10 xl:w-10 rounded-full bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center text-white text-sm font-medium shadow-lg flex-shrink-0 ring-2 ring-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {userData?.name
                ? userData.name.substring(0, 2).toUpperCase()
                : "..."}
            </div>
            {/* User Info Tooltip for collapsed state */}
            <div className="md:hidden xl:block">
              <span className="text-sm font-medium text-gray-900 block truncate">
                {userData?.name || "Loading..."}
              </span>
              <p className="text-xs text-gray-500">
                {userData?.userType === "admin"
                  ? "Super Admin"
                  : userData?.userType === "staff"
                  ? "Expert"
                  : "Student"}
              </p>
            </div>
            {/* Enhanced hover tooltip for collapsed sidebar */}
            <div className="hidden md:block xl:hidden absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-95 text-white text-xs rounded-xl px-4 py-3 opacity-0 group-hover/header:opacity-100 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap z-[9999] group-hover/header:delay-150 shadow-2xl border border-gray-700 backdrop-blur-md transform scale-95 group-hover/header:scale-100">
              <div className="font-semibold text-white">
                {userData?.name || "Loading..."}
              </div>
              <div className="text-gray-300 text-xs mt-1">
                {userData?.userType === "admin"
                  ? "Super Admin"
                  : userData?.userType === "staff"
                  ? "Expert"
                  : "Student"}
              </div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-2 xl:p-3 md:sidebar-no-scroll xl:overflow-y-auto xl:main-scroll">
          <div className="space-y-1 md:space-y-2 mb-6 md:mb-8">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              const content = (
                <Link
                  to={item.path}
                  className={`
                    group flex items-center md:justify-center xl:justify-start gap-3 px-4 md:px-3 xl:px-4 py-3 md:py-2.5 xl:py-3 
                    text-sm md:text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-navy to-navy-dark text-white shadow-lg transform scale-105 ring-2 ring-navy/20"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-navy hover:scale-105 hover:shadow-md"
                    }
                  `}
                >
                  <div className="relative flex items-center md:justify-center">
                    <item.icon
                      className={`
                        h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5 flex-shrink-0 transition-transform duration-200 font-bold
                        sidebar-icon-enhanced md:icon-pulse-hover
                        ${
                          isActive
                            ? "text-white drop-shadow-sm sidebar-icon-active"
                            : "text-gray-400 group-hover:text-navy group-hover:scale-125 md:stroke-2"
                        }
                      `}
                      strokeWidth={isActive ? "2.5" : "2"}
                    />
                    {"alert" in item && item.alert && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="md:hidden xl:block truncate transition-all duration-200">
                    {item.name}
                  </span>
                </Link>
              );

              return (
                <div key={item.name}>
                  <NavTooltip text={item.name}>{content}</NavTooltip>
                </div>
              );
            })}
          </div>

          {/* Policy Items for Students */}
          {policyItems.length > 0 && (
            <div className="space-y-1 md:space-y-2 border-t border-gray-200/60 pt-4 md:pt-6">
              <div className="px-4 md:px-3 xl:px-4 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider md:hidden xl:block">
                  Policies
                </h3>
              </div>
              {policyItems.map((item) => {
                const isActive = currentPath === item.path;
                const content = (
                  <Link
                    to={item.path}
                    className={`
                      group flex items-center md:justify-center xl:justify-start gap-3 px-4 md:px-3 xl:px-4 py-2.5 md:py-2 xl:py-2.5 
                      text-sm md:text-xs xl:text-sm rounded-lg transition-all duration-200 relative
                      ${
                        isActive
                          ? "text-navy font-medium bg-gradient-to-r from-navy/10 to-navy/5 shadow-sm transform scale-105 ring-1 ring-navy/20"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-navy hover:scale-105 hover:shadow-md"
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        h-4 w-4 md:h-5 md:w-5 xl:h-4 xl:w-4 flex-shrink-0 transition-transform duration-200 font-bold
                        sidebar-icon-enhanced md:icon-pulse-hover
                        ${
                          isActive
                            ? "text-navy drop-shadow-sm sidebar-icon-active"
                            : "text-gray-400 group-hover:text-navy group-hover:scale-125 md:stroke-2"
                        }
                      `}
                      strokeWidth={isActive ? "2.5" : "2"}
                    />
                    <span className="md:hidden xl:block truncate transition-all duration-200">
                      {item.name}
                    </span>
                  </Link>
                );

                return (
                  <div key={item.name}>
                    <NavTooltip text={item.name}>{content}</NavTooltip>
                  </div>
                );
              })}
            </div>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-3 md:p-2 xl:p-3 border-t border-gray-200/60">
          <NavTooltip text="Sign Out">
            <button
              onClick={useAuth().logout}
              className="w-full flex items-center md:justify-center xl:justify-start gap-3 px-4 md:px-3 xl:px-4 py-3 md:py-2.5 xl:py-3 text-sm md:text-xs xl:text-sm text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md group relative"
            >
              <FiLogOut
                className="h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5 text-gray-400 group-hover:text-red-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125 md:stroke-2 font-bold sidebar-icon-enhanced md:icon-pulse-hover"
                strokeWidth="2"
              />
              <span className="md:hidden xl:block truncate transition-all duration-200">
                Sign Out
              </span>
            </button>
          </NavTooltip>
        </div>
      </aside>
    </>
  );
}
