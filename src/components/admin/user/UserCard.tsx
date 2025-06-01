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
      {user.userType === "staff" && !user.isApproved && (
        <div className="absolute -top-2 -right-2 z-20">
          <span className="inline-flex items-center px-2 py-1 bg-orange-500/75 text-white text-[10px] font-semibold rounded-lg shadow-lg border-2 border-white backdrop-blur-sm">
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
              user.userType === "staff"
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-purple-600"
            }`}
          >
            {(user.name || user.username)?.charAt(0).toUpperCase()}
          </div>
        )}{" "}
        {/* Rate Display - Only for Staff */}
        {user.userType === "staff" && user.rate && (
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex items-center px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-lg">
              <FiDollarSign className="w-3 h-3 mr-1" />
              <span>
                {user.rate?.includes("/hour") || user.rate?.includes("/hr")
                  ? user.rate.replace(/^\$/, "")
                  : `${user.rate?.replace(/^\$/, "")}/hr`}
              </span>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Card Content - Colored Background - Fixed Height */}
      <div
        className={`flex-grow flex flex-col justify-center min-h-[60px] px-3 gap-1 ${
          user.userType === "staff"
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
