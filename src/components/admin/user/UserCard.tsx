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
        <div className="absolute -top-3 -right-3 z-20">
          <span className="inline-flex items-center px-3 py-1.5 bg-orange-500/75 text-white text-xs font-semibold rounded-full shadow-lg border-2 border-white backdrop-blur-sm">
            Pending
          </span>
        </div>
      )}{" "}
      {/* Photo Section - Optimized Height */}
      <div className="relative h-40 overflow-hidden rounded-t-xl">
        {user.profilePicture || user.image ? (
          <img
            src={user.profilePicture || user.image}
            alt={user.name || user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-white font-bold text-4xl ${
              user.type === "staff"
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-purple-600"
            }`}
          >
            {(user.name || user.username)?.charAt(0).toUpperCase()}
          </div>
        )}{" "}
        {/* User Type Badge with Rate */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md border border-white/30 ${
              user.type === "staff"
                ? "bg-blue-500/75 text-white"
                : "bg-purple-500/75 text-white"
            }`}
          >
            {user.type === "staff" ? "Expert" : "Student"}
          </span>{" "}
          {/* Rate beside Expert badge - More transparent and elegant */}
          {user.type === "staff" && user.rate && (
            <span className="inline-flex items-center px-2.5 py-1 bg-white/20 text-white rounded-lg text-xs font-medium shadow-sm backdrop-blur-md border border-white/30">
              <FiDollarSign className="w-3 h-3 mr-0.5" />
              {typeof user.rate === "string"
                ? user.rate.replace(/^\$|\$|\/hour$/g, "").replace(/\/h$/, "")
                : user.rate}
              /hr
            </span>
          )}
        </div>
      </div>{" "}
      {/* Card Content - Colored Background - Fixed Height */}
      <div
        className={`flex-grow flex flex-col justify-center min-h-[70px] px-3 p-3 gap-1 ${
          user.type === "staff"
            ? "bg-gradient-to-br from-blue-50 to-blue-100"
            : "bg-gradient-to-br from-purple-50 to-purple-100"
        }`}
      >
        {/* Name */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 text-base leading-tight truncate px-2">
            {user.name || user.username}
          </h3>
        </div>

        {/* Email with Tooltip */}
        <div className="text-center mb-3">
          <p
            className="text-sm text-gray-600 truncate px-2 cursor-help"
            title={user.email}
          >
            {user.email}
          </p>
        </div>

        {/* Date Joined - Always at bottom */}
        <div className="text-center">
          <div
            className="text-xs text-gray-600 font-normal"
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
