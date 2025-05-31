import { FiChevronRight, FiHome } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Generate breadcrumb items based on the current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Add home based on dashboard type
    if (pathname.startsWith("/admin-dashboard")) {
      items.push({
        label: "Admin Dashboard",
        path: "/admin-dashboard",
        icon: FiHome,
      });
    } else if (pathname.startsWith("/staff-dashboard")) {
      items.push({
        label: "Expert Dashboard",
        path: "/staff-dashboard",
        icon: FiHome,
      });
    } else if (pathname.startsWith("/student-dashboard")) {
      items.push({
        label: "Student Dashboard",
        path: "/student-dashboard",
        icon: FiHome,
      });
    } else {
      items.push({ label: "Dashboard", path: "/", icon: FiHome });
    }

    // Map path segments to readable labels
    const segmentLabels: Record<string, string> = {
      "admin-dashboard": "Admin Dashboard",
      "staff-dashboard": "Expert Dashboard",
      "student-dashboard": "Student Dashboard",
      users: "User Management",
      experts: "Expert Applications",
      categories: "Expert Categories",
      content: "Content Management",
      bookings: "All Bookings",
      messages: "Message Center",
      payments: "Payment Management",
      availability: "Availability",
      profile: "Profile",
      "terms-of-use": "Terms of Use",
      "booking-policy": "Booking Policy",
      "privacy-policy": "Privacy Policy",
      "browse-experts": "Browse Experts",
    };

    // Build breadcrumb path
    let currentPath = "";
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

      // Skip the first segment if it's already in home
      if (
        i === 0 &&
        (segment === "admin-dashboard" ||
          segment === "staff-dashboard" ||
          segment === "student-dashboard")
      ) {
        continue;
      }

      const label =
        segmentLabels[segment] ||
        segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      // Only add as clickable if not the last item
      if (i < pathSegments.length - 1) {
        items.push({ label, path: currentPath });
      } else {
        items.push({ label });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumb on login or signup pages
  if (
    pathname === "/login" ||
    pathname.includes("signup") ||
    pathname === "/"
  ) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-gray-200/50">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <FiChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
          )}

          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center gap-2 text-gray-600 hover:text-navy transition-colors duration-200 hover:bg-navy/5 px-2 py-1 rounded-lg group"
            >
              {item.icon && index === 0 && (
                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-navy transition-colors duration-200" />
              )}
              <span className="font-medium group-hover:font-semibold transition-all duration-200">
                {item.label}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-navy font-semibold">
              {item.icon && index === 0 && (
                <item.icon className="w-4 h-4 text-navy" />
              )}
              <span>{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
