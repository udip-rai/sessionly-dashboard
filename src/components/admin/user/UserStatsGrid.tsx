import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { UserStatsGridProps } from "./types";

export const UserStatsGrid: React.FC<UserStatsGridProps> = ({
  stats,
  onBoxClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div
        onClick={() => onBoxClick && onBoxClick("totalUsers")}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-100 transition-opacity duration-300 h-[46%]"></div>
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
            +12%
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
          {stats.totalUsers}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
            Total Users
          </p>
          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
        </div>
      </div>

      {/* Pending Approvals */}
      <div
        onClick={() => onBoxClick && onBoxClick("pendingApprovals")}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-100 transition-opacity duration-300 h-[46%]"></div>
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FiClock className="w-6 h-6 text-white" />
          </div>
          <div className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
            Pending
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors duration-300">
          {stats.pendingApprovals}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
            Pending Approvals
          </p>
          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-orange-500" />
        </div>
      </div>

      {/* Active Experts */}
      <div
        onClick={() => onBoxClick && onBoxClick("activeStaff")}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-100 transition-opacity duration-300 h-[46%]"></div>
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FiUserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Active
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors duration-300">
          {stats.activeStaff}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
            Active Experts
          </p>
          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-green-500" />
        </div>
      </div>

      {/* Total Students */}
      <div
        onClick={() => onBoxClick && onBoxClick("totalStudents")}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-100 transition-opacity duration-300 h-[46%]"></div>
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FiUserPlus className="w-6 h-6 text-white" />
          </div>
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
            +8%
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors duration-300">
          {stats.totalStudents}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
            Total Students
          </p>
          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-purple-500" />
        </div>
      </div>
    </div>
  );
};
