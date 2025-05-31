import React from "react";
import { FiUsers, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { UserCard } from "./UserCard";
import { UserGridProps } from "./types";

export const UserGrid: React.FC<UserGridProps> = ({
  users,
  onUserClick,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
}) => {
  return (
    <>
      {/* Results Summary and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiUsers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{users.length}</span>{" "}
            users
          </p>
        </div>
        {/* Enhanced Sorting Controls */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSortChange("name")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                sortBy === "name"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              Name
            </button>
            <button
              onClick={() => onSortChange("date")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                sortBy === "date"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              Date
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
              className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all duration-200 group"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              {sortOrder === "asc" ? (
                <FiArrowUp className="w-4 h-4 group-hover:text-blue-500" />
              ) : (
                <FiArrowDown className="w-4 h-4 group-hover:text-blue-500" />
              )}
            </button>
          </div>
        </div>{" "}
      </div>{" "}
      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id || user._id}
            user={user}
            onUserClick={onUserClick}
          />
        ))}
      </div>
      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      )}
    </>
  );
};
