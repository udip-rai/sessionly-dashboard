import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserProfileModalProps } from "./types";

dayjs.extend(relativeTime);

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onApprove,
  onReject,
  onImageZoom,
}) => {
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
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className={`p-6 border-b flex-shrink-0 ${
              user.type === "staff"
                ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                : "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.profilePicture || user.image ? (
                    <img
                      src={user.profilePicture || user.image}
                      alt={user.name || user.username}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg cursor-pointer"
                      onClick={handleImageClick}
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                        user.type === "staff"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : "bg-gradient-to-br from-purple-500 to-purple-600"
                      }`}
                    >
                      {(user.name || user.username)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${
                      user.status === "active"
                        ? "bg-green-500"
                        : user.status === "inactive"
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                  ></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.name || user.username}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.type === "staff"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {user.type === "staff" ? "Expert" : "Student"}
                    </span>
                    {user.type === "staff" && !user.isApproved && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        Pending Approval
                      </span>
                    )}
                    {user.emailVerified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPhone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expert Specific Information */}
            {user.type === "staff" && (
              <>
                {/* Bio */}
                {user.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Bio
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Rate */}
                {user.rate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Rate
                    </h3>
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <FiDollarSign className="w-4 h-4" />
                      <span>{user.rate}</span>
                    </div>
                  </div>
                )}

                {/* Advisory Topics */}
                {user.advisoryTopics && user.advisoryTopics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Advisory Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.advisoryTopics.map(
                        (topic: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-200"
                          >
                            {topic}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Expertise Areas */}
                {user.expertiseAreas && user.expertiseAreas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Expertise Areas ({user.expertiseAreas.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.expertiseAreas.map((area: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200"
                        >
                          {typeof area === "string"
                            ? area
                            : `${area.category || "Category"} - ${
                                area.subCategory || "Subcategory"
                              }`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {user.certificates && user.certificates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Certificates ({user.certificates.length})
                    </h3>
                    <div className="space-y-3">
                      {user.certificates.map((cert: any, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {cert.name}
                              </h4>
                              {cert.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {cert.description}
                                </p>
                              )}
                              {cert.issueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Issued:{" "}
                                  {dayjs(cert.issueDate).format(
                                    "MMMM DD, YYYY",
                                  )}
                                </p>
                              )}
                            </div>
                            {cert.fileUrl && (
                              <a
                                href={cert.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CV */}
                {user.cv && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      CV/Resume
                    </h3>
                    <a
                      href={user.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View CV/Resume
                    </a>
                  </div>
                )}

                {/* Social Links */}
                {(user.linkedinUrl ||
                  user.websiteUrl ||
                  (user.otherUrls && user.otherUrls.length > 0)) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Links
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.linkedinUrl && (
                        <a
                          href={user.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {user.websiteUrl && (
                        <a
                          href={user.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Website
                        </a>
                      )}
                      {user.otherUrls &&
                        user.otherUrls.map((url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Link {index + 1}
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Account Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Status: </span>
                  <span
                    className={`capitalize ${
                      user.status === "active"
                        ? "text-green-600"
                        : user.status === "inactive"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Joined: </span>
                  <span
                    title={`${new Date(
                      user.createdAt || user.joinedDate || Date.now(),
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  >
                    {dayjs(user.createdAt || user.joinedDate).fromNow()}
                  </span>
                </div>
                {user.rating && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Rating: </span>
                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{user.rating}</span>
                  </div>
                )}
                {user.totalSessions && (
                  <div>
                    <span className="font-medium">Total Sessions: </span>
                    {user.totalSessions}
                  </div>
                )}
                {user.googleId && (
                  <div>
                    <span className="font-medium">Google Account: </span>
                    <span className="text-green-600">Connected</span>
                  </div>
                )}
                {user.emailVerified !== undefined && (
                  <div>
                    <span className="font-medium">Email Verified: </span>
                    <span
                      className={
                        user.emailVerified ? "text-green-600" : "text-red-600"
                      }
                    >
                      {user.emailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {user.type === "staff" &&
                  user.isApproved &&
                  user.approvedAt && (
                    <div>
                      <span className="font-medium">Approved: </span>
                      <span
                        title={`${new Date(user.approvedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}`}
                      >
                        {dayjs(user.approvedAt).fromNow()}
                      </span>
                    </div>
                  )}
                {user._id && (
                  <div className="col-span-2">
                    <span className="font-medium">User ID: </span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {user._id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions for Staff */}
            {user.type === "staff" && (
              <div className="pt-4 border-t border-gray-200">
                {!user.isApproved ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Approve Expert
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Reject Expert
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200">
                      <FiCheck className="w-4 h-4 mr-2" />✓ Approved Expert
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal at document root level
  return createPortal(modalContent, document.body);
};
