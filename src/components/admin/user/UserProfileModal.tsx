import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserProfileModalProps } from "./types";
import { DesktopModal } from "./modal/DesktopModal";
import { MobileModal } from "./modal/MobileModal";
import { copyToClipboard } from "../../../utils/string";

dayjs.extend(relativeTime);

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onApprove,
  onReject,
  onImageZoom,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Prevent layout shift

      // Also prevent scrolling on the html element
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup function to reset styles when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleApprove = () => {
    const userId = user.id || user._id;
    if (userId && onApprove) {
      onApprove(userId);
      onClose();
    }
  };

  const handleReject = () => {
    const userId = user.id || user._id;
    if (userId && onReject) {
      onReject(userId, user.name || user.username || "");
      onClose();
    }
  };

  const handleImageClick = () => {
    if (onImageZoom && (user.profilePicture || user.image)) {
      onImageZoom(
        user.profilePicture || user.image || "",
        user.name || user.username || "",
      );
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  // Prepare modal props
  const modalProps = {
    user,
    handleImageClick,
    copiedField,
    handleApprove,
    handleReject,
    copyToClipboard: (text: string, fieldName: string) =>
      copyToClipboard(text, fieldName, setCopiedField),
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999, // Extremely high z-index to ensure it's above everything
      }}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header - Minimal */}
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
                        user.userType === "staff"
                          ? "bg-blue-200"
                          : "bg-purple-200"
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
                  )}
                  {user.emailVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* User Name */}
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                  {user.name || user.username}
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

          {/* Modal Content - Responsive Layout */}
          <div
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#64748b #e2e8f0",
            }}
          >
            {/* Mobile Layout - Profile Image & Quick Stats First */}
            <MobileModal {...modalProps} />

            {/* Desktop Layout - Original Two Column Grid */}
            <DesktopModal {...modalProps} />
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal at document root level
  return createPortal(modalContent, document.body);
};
