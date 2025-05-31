import React from "react";
import { FiDollarSign } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserCardProps } from "./types";

dayjs.extend(relativeTime);

export const UserCard: React.FC<UserCardProps> = ({ user, onUserClick }) => {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible cursor-pointer group flex flex-col w-full h-full relative mx-auto"
      onClick={() => onUserClick(user)}
    >
      {" "}
      {/* Pending Tag - Outside card container */}
      {user.type === "staff" && !user.isApproved && (
        <div className="absolute -top-2 -right-2 z-20">
          <span className="inline-flex items-center px-2 py-1 bg-orange-500/75 text-white text-[10px] font-semibold rounded-full shadow-lg border-2 border-white backdrop-blur-sm">
            Pending
          </span>
        </div>
      )}{" "}
      {/* Photo Section - Optimized Height */}
      <div className="relative h-40 overflow-hidden rounded-t-xl">
        {" "}
        {user.profilePicture || user.image ? (
          <img
            src={user.profilePicture || user.image}
            alt={user.name || user.username}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-white font-bold text-4xl transition-transform duration-500 group-hover:scale-110 ${
              user.type === "staff"
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-purple-600"
            }`}
          >
            {(user.name || user.username)?.charAt(0).toUpperCase()}
          </div>
        )}{" "}
        {/* Cool Dollar Rate Display - Only for Staff */}
        {user.type === "staff" && user.rate && (
          <div className="absolute bottom-3 left-3">
            <div className="relative group">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-xl opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-300 animate-pulse"></div>
              {/* Main rate container with enhanced styling */}
              <div className="relative inline-flex items-center px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white rounded-lg text-xs font-bold shadow-2xl backdrop-blur-md border border-white/40 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                {/* Animated dollar icon with special effects */}
                <div className="relative mr-1">
                  <FiDollarSign className="w-3 h-3 relative z-10 drop-shadow-sm" />
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Rate text with enhanced typography */}
                <span className="relative z-10 tracking-wide drop-shadow-sm">
                  {typeof user.rate === "string"
                    ? user.rate
                        .replace(/^\$|\$|\/hour$/g, "")
                        .replace(/\/h$/, "")
                    : user.rate}
                </span>
                <span className="text-emerald-100 text-xs ml-0.5 font-medium">
                  /hr
                </span>

                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-500 rounded-lg"></div>
              </div>

              {/* Floating sparkle effects */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-150 transition-opacity duration-300"></div>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Card Content - Colored Background - Fixed Height */}
      <div
        className={`flex-grow flex flex-col justify-center min-h-[60px] px-3 gap-1 ${
          user.type === "staff"
            ? "bg-gradient-to-br from-blue-50 to-blue-200"
            : "bg-gradient-to-br from-purple-50 to-purple-200"
        }`}
      >
        {" "}
        {/* Name */}
        <div className="text-center">
          <h3
            className="font-semibold text-gray-900 text-sm leading-tight truncate px-2 cursor-help"
            title={user.name || user.username}
          >
            {user.name || user.username}
          </h3>
        </div>{" "}
        {/* Date Joined - Always at bottom */}
        <div className="text-center">
          <div
            className="text-[10px] text-gray-500 font-normal"
            title={`Joined on ${new Date(
              user.createdAt || user.joinedDate || Date.now(),
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          >
            Joined {dayjs(user.createdAt || user.joinedDate).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};
