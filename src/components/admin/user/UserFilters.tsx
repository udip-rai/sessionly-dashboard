import React from "react";
import { FiSearch } from "react-icons/fi";
import { UserFiltersProps } from "./types";

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-300 p-4 sm:p-6 mb-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Filter Tabs - Full width on mobile, compact on larger screens */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => onFilterChange("type", "all")}
            className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              filters.type === "all"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            All Users
          </button>

          <button
            onClick={() => onFilterChange("type", "student")}
            className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              filters.type === "student"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => onFilterChange("type", "staff")}
            className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              filters.type === "staff"
                ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Experts
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>{" "}
        {/* Status Filter - Only show for staff/experts */}
        {filters.type === "staff" && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm font-semibold text-gray-700 mr-2">
              Status:
            </span>
            <button
              onClick={() => onFilterChange("status", "all")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                filters.status === "all"
                  ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange("status", "active")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                filters.status === "active"
                  ? "bg-green-100 text-green-700 ring-2 ring-green-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onFilterChange("status", "inactive")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                filters.status === "inactive"
                  ? "bg-orange-100 text-orange-700 ring-2 ring-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
