import React from "react";
import { FiUsers, FiUserCheck, FiUserPlus, FiClock } from "react-icons/fi";
import { UserStatsGridProps } from "./types";

export const UserStatsGrid: React.FC<UserStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
            +12%
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalUsers}
        </h3>
        <p className="text-sm text-gray-600">Total Users</p>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <FiClock className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
            Pending
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.pendingApprovals}
        </h3>
        <p className="text-sm text-gray-600">Pending Approvals</p>
      </div>

      {/* Active Experts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <FiUserCheck className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Active
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.activeStaff}
        </h3>
        <p className="text-sm text-gray-600">Active Experts</p>
      </div>

      {/* Total Students */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <FiUserPlus className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
            +8%
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalStudents}
        </h3>
        <p className="text-sm text-gray-600">Total Students</p>
      </div>
    </div>
  );
};
