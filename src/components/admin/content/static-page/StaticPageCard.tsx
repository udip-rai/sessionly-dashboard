import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { StaticPage } from "../../../../api/services/admin.service";
import { TimestampBadges } from "../../../ui";

interface StaticPageCardProps {
  page: StaticPage;
  onEdit: (page: StaticPage) => void;
  onDelete: (pageId: string, title: string) => void;
  loading?: boolean;
}

export const StaticPageCard = ({ 
  page, 
  onEdit, 
  onDelete, 
  loading = false 
}: StaticPageCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
      {/* Ribbon Badge */}
      <div className="absolute top-0 left-0 z-10">
        <div
          className={`relative px-3 py-1 text-xs font-semibold text-white shadow-md ${
            page.type === "home"
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : page.type === "about"
              ? "bg-gradient-to-r from-blue-500 to-blue-600"
              : page.type === "team"
              ? "bg-gradient-to-r from-purple-500 to-purple-600"
              : "bg-gradient-to-r from-gray-500 to-gray-600"
          }`}
          style={{
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)"
          }}
        >
          {page.type.charAt(0).toUpperCase() + page.type.slice(1)}
          {/* Small triangle shadow effect */}
          <div 
            className={`absolute top-full left-0 w-2 h-2 ${
              page.type === "home"
                ? "bg-green-700"
                : page.type === "about"
                ? "bg-blue-700"
                : page.type === "team"
                ? "bg-purple-700"
                : "bg-gray-700"
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)"
            }}
          />
        </div>
      </div>
      
      <div className="p-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TimestampBadges
                createdAt={page.createdAt}
                updatedAt={page.updatedAt}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {page.title || "—"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(page)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={loading}
              title="Edit Page"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(page._id, page.title)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              disabled={loading}
              title="Delete Page"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
