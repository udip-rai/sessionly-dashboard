import React from "react";
import { FiX } from "react-icons/fi";

interface User {
  userType: string;
  isApproved?: boolean;
  emailVerified?: boolean;
  name?: string;
  username?: string;
}

interface ModalHeaderProps {
  user: User;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ user, onClose }) => {
  return (
    <div
      className={`p-4 border-b flex-shrink-0 ${
        user.userType === "staff"
          ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
          : "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          {/* User Type Badge - More Prominent */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                user.userType === "staff"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-300"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-2 border-purple-300"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  user.userType === "staff" ? "bg-blue-200" : "bg-purple-200"
                }`}
              ></div>
              {user.userType === "staff" ? "🎯 EXPERT" : "📚 STUDENT"}
            </span>
            {user.userType === "staff" && user.isApproved && (
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-2 border-emerald-300 shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="w-3 h-3 rounded-full mr-2 bg-emerald-200"></div>
                ✅ APPROVED EXPERT
              </span>
            )}
            {user.userType === "staff" && !user.isApproved && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white border-2 border-orange-300 shadow-lg animate-pulse">
                ⏳ Pending Approval
              </span>
            )}{" "}
          </div>

          {/* User Name with Verified Badge */}
          <h2 className="text-3xl font-bold text-gray-900 leading-tight flex items-center">
            {user.name || user.username}
            {user.emailVerified && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                ✓ Verified
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="group relative p-3 bg-gradient-to-br from-red-50 via-red-100 to-red-200 hover:from-red-100 hover:via-red-200 hover:to-red-300 rounded-full border-2 border-red-300/60 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-180 overflow-hidden"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-red-600/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

          {/* Rotating shine effect */}
          <div className="absolute inset-0 bg-conic-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full animate-spin-slow"></div>

          {/* Main icon */}
          <FiX className="w-5 h-5 text-red-700 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:text-red-800" />

          {/* Pulsing outer ring */}
          <div className="absolute inset-0 border-2 border-red-400/50 rounded-full animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};
