import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isStaffDashboard = location.pathname.startsWith("/expert-dashboard");
  const { isAuthenticated } = useAuth();

  const navLinks = isStaffDashboard
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

  // Handle mobile menu close
  const handleMobileMenuClose = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 backdrop-blur-md shadow-lg flex-none relative z-30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-transparent to-blue-100/50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent)] animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center md:justify-start justify-center flex-1 md:flex-none">
            <div className="hover:scale-105 transition-all duration-300">
              <Logo />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Navigation Links */}
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-gray-600 hover:text-navy px-2 lg:px-4 py-2 rounded-xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-navy/5 hover:to-navy/10 hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10 font-medium text-xs lg:text-sm">
                  {link.label}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-navy/10 to-navy/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-navy to-navy-dark transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-300"></div>
              </a>
            ))}

            {/* Auth Section */}
            <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-200 flex items-center">
              {!isAuthenticated && (
                <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-200">
                  <a
                    href="/login"
                    className="relative inline-flex items-center justify-center px-3 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-navy via-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 text-xs lg:text-sm">
                      Sign In
                    </span>
                    <div className="relative z-10 ml-1 lg:ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      <svg
                        className="w-3 h-3 lg:w-4 lg:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 border border-white/20 rounded-xl"></div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-navy hover:bg-navy/5 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/60 bg-white/90 backdrop-blur-sm rounded-b-xl mt-2 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 hover:text-navy hover:bg-navy/5 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileMenuClose}
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Auth Section */}
              {!isAuthenticated && (
                <div className="pt-2 border-t border-gray-200/60">
                  <a
                    href="/login"
                    className="block w-full text-center px-3 py-2 bg-gradient-to-r from-navy via-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleMobileMenuClose}
                  >
                    Sign In
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent"></div>
      </div>
    </nav>
  );
}
