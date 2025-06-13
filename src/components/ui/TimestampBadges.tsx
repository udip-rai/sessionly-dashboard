import React from "react";

export interface TimestampBadgesProps {
  createdAt: string;
  updatedAt?: string;
  variant?: "green" | "blue" | "purple" | "indigo";
}

export const TimestampBadges: React.FC<TimestampBadgesProps> = ({
  createdAt,
  updatedAt,
  variant = "green",
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVariantClasses = (type: "created" | "updated") => {
    const baseClasses =
      "flex items-center gap-1.5 px-3 py-1.5 border rounded-full";

    if (type === "created") {
      switch (variant) {
        case "green":
          return `${baseClasses} bg-green-50 border-green-200 text-green-700`;
        case "blue":
          return `${baseClasses} bg-blue-50 border-blue-200 text-blue-700`;
        case "purple":
          return `${baseClasses} bg-purple-50 border-purple-200 text-purple-700`;
        case "indigo":
          return `${baseClasses} bg-indigo-50 border-indigo-200 text-indigo-700`;
        default:
          return `${baseClasses} bg-green-50 border-green-200 text-green-700`;
      }
    } else {
      // Updated always uses blue variant for consistency
      return `${baseClasses} bg-blue-50 border-blue-200 text-blue-700`;
    }
  };

  const getIconColor = (type: "created" | "updated") => {
    if (type === "created") {
      switch (variant) {
        case "green":
          return "text-green-600";
        case "blue":
          return "text-blue-600";
        case "purple":
          return "text-purple-600";
        case "indigo":
          return "text-indigo-600";
        default:
          return "text-green-600";
      }
    } else {
      return "text-blue-600";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-2">
      {/* Created timestamp */}
      <div className={getVariantClasses("created")}>
        <svg
          className={`w-3.5 h-3.5 ${getIconColor("created")}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs font-medium">
          Created: {formatDate(createdAt)}
        </span>
      </div>

      {/* Updated timestamp - only show if different from created */}
      {updatedAt && updatedAt !== createdAt && (
        <div className={getVariantClasses("updated")}>
          <svg
            className={`w-3.5 h-3.5 ${getIconColor("updated")}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-xs font-medium">
            Updated: {formatDate(updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
};
