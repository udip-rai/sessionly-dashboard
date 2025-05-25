import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export function Navbar() {
  const location = useLocation();
  const isExpertDashboard = location.pathname.startsWith("/expert-dashboard");

  const navLinks = isExpertDashboard
    ? [
        { href: "#", label: "About Sessionly" },
        { href: "#", label: "FAQs" },
      ]
    : [
        { href: "#", label: "For Experts" },
        { href: "#", label: "Browse Experts" },
        { href: "#", label: "About Sessionly" },
        { href: "#", label: "FAQs" },
      ];

  return (
    <nav className="bg-gradient-to-r from-white from-0% via-navy via-60% to-navy-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
