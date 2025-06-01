import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export const RouteTester: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    console.log("Route Tester - Current location:", location.pathname);
    console.log("User authenticated:", isAuthenticated);
    console.log("User role:", userRole);
  }, [location, isAuthenticated, userRole]);

  const testRoutes = [
    {
      name: "Student Dashboard",
      path: "/student-dashboard",
      role: "student",
    },
    {
      name: "Student Profile",
      path: "/student-dashboard/profile",
      role: "student",
    },
    {
      name: "Expert Dashboard",
      path: "/staff-dashboard",
      role: "staff",
    },
    {
      name: "Expert Profile",
      path: "/staff-dashboard/profile",
      role: "staff",
    },
    {
      name: "Admin Dashboard",
      path: "/admin-dashboard",
      role: "admin",
    },
  ];

  const navigateToRoute = (path: string) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Route Testing Dashboard
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Current Session Info
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 w-40">
                Authenticated:
              </span>
              <span className="flex items-center">
                {isAuthenticated ? (
                  <>
                    <FiCheck className="text-green-500 w-5 h-5 mr-1" /> Yes
                  </>
                ) : (
                  <>
                    <FiX className="text-red-500 w-5 h-5 mr-1" /> No
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 w-40">User Role:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {userRole || "None"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-40">
                Current Path:
              </span>
              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                {location.pathname}
              </code>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Test Navigation
          </h2>
          <div className="space-y-3">
            {testRoutes.map((route) => (
              <div
                key={route.path}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-800">{route.name}</div>
                  <div className="text-sm text-gray-500">
                    <code className="font-mono">{route.path}</code>
                    <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                      {route.role} role
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateToRoute(route.path)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Navigate
                  </button>
                  <a
                    href={route.path}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm inline-flex items-center"
                  >
                    href
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Navigation Troubleshooting
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              If you're experiencing navigation issues, try the following:
            </p>
            <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
              <li>Check the browser console for any errors or warnings</li>
              <li>
                Verify that you have the correct user role for the route you're
                trying to access
              </li>
              <li>
                Try both useNavigate and direct href links to compare behavior
              </li>
              <li>Check if you're already authenticated properly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTester;
