import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Determine the home route based on user type
  const getHomeRoute = () => {
    if (!user) return "/login";
    switch (user.userType) {
      case "admin":
        return "/admin-dashboard";
      case "staff":
        return "/staff-dashboard";
      case "student":
        return "/student-dashboard";
      default:
        return "/login";
    }
  };

  const homeRoute = getHomeRoute();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
          <FiAlertTriangle
            className="w-10 h-10 text-red-500"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn't find{" "}
          <span className="font-medium text-red-500">{location.pathname}</span>
        </p>

        <div className="space-y-3">
          <Link
            to={homeRoute}
            className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-dark text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
          >
            <FiHome className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFoundPage;
