import dayjs from "dayjs";
import { useState } from "react";
import {
  FiDollarSign,
  FiStar,
  FiPhone,
  FiMail,
  FiCheck,
  FiCopy,
  FiUser,
  FiFileText,
  FiX,
  FiLink,
  FiGlobe,
  FiLinkedin,
  FiExternalLink,
} from "react-icons/fi";

export const MobileModal = ({
  user,
  handleImageClick,
  handleApprove,
  handleReject,
  copiedField,
  copyToClipboard,
}: {
  user: any;
  handleImageClick: () => void;
  handleApprove: () => void;
  handleReject: () => void;
  copiedField: string | null;
  copyToClipboard: (text: string, fieldName: string) => void;
}) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  // Determine the theme color based on user type
  const themeColor =
    user.userType === "staff"
      ? {
          primary: "blue",
          secondary: "indigo",
          headingBg: "from-blue-50",
          headingBorder: "border-l-3 border-blue-500",
        }
      : {
          primary: "purple",
          secondary: "pink",
          headingBg: "from-purple-50",
          headingBorder: "border-l-3 border-purple-500",
        };

  return (
    <div className="block lg:hidden">
      {/* Confirmation Modal for Approve */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-xs w-full mx-4 border border-green-200 transform scale-100 animate-pulse">
            <h3
              className={`text-base font-bold text-${themeColor.primary}-800 mb-2 flex items-center`}
            >
              <FiCheck className={`w-4 h-4 mr-1.5 text-green-600`} />
              Confirm Approval
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to approve {user.name || user.username}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleApprove();
                  setShowApproveConfirm(false);
                }}
                className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reject */}
      {showRejectConfirm && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-xs w-full mx-4 border border-red-100 transform scale-100 animate-pulse">
            <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center">
              <FiX className="w-4 h-4 mr-1.5 text-red-600" />
              Confirm Rejection
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to reject {user.name || user.username}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectConfirm(false)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReject();
                  setShowRejectConfirm(false);
                }}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Profile Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 border-b border-gray-200">
        <div className="flex flex-col items-center space-y-2">
          {/* Animated Profile Image Rectangle - Mobile */}
          <div className="w-48 sm:w-56">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-100 shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-500 transform hover:scale-105">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Flip Container */}
              <div className="relative w-full h-48 perspective-1000">
                <div className="absolute inset-0 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    {user.profilePicture || user.image ? (
                      <div className="expert-image-container w-full h-full">
                        <img
                          src={user.profilePicture || user.image}
                          alt={user.name || user.username}
                          className="w-full h-full object-cover cursor-pointer transition-all duration-500 expert-image-zoom"
                          onClick={handleImageClick}
                        />
                        <div className="expert-image-overlay"></div>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-white font-bold text-4xl ${
                          user.userType === "staff"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : "bg-gradient-to-br from-purple-500 to-purple-600"
                        }`}
                      >
                        {(user.name || user.username)?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-md cursor-help ${
                        user.status === "active"
                          ? "bg-green-500"
                          : user.status === "inactive"
                          ? "bg-orange-400"
                          : "bg-red-500"
                      }`}
                      title={`Status: ${
                        user.status === "active"
                          ? "Active & Available"
                          : user.status === "inactive"
                          ? "Inactive"
                          : "Blocked/Suspended"
                      }`}
                    ></div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center text-white p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <h3 className="text-lg font-bold">
                          {user.name || user.username}
                        </h3>
                        {user.emailVerified && (
                          <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800 border border-green-300">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-blue-100 text-xs mb-2">
                        {user.userType === "staff" ? "Expert" : "Student"}
                      </p>
                      {user.userType === "staff" && user.rate && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 mb-2">
                          <div className="flex items-center justify-center text-base font-bold">
                            <FiDollarSign className="w-4 h-4 mr-1" />
                            {user.rate?.includes("/hour") ||
                            user.rate?.includes("/hr")
                              ? user.rate
                              : `${user.rate}/hr`}
                          </div>
                        </div>
                      )}
                      {user.userType === "staff" && user.rating && (
                        <div className="flex items-center justify-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-300 fill-current" />
                          <span className="text-base font-semibold">
                            {user.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-full group-hover:translate-x-0"></div>
            </div>
          </div>{" "}
          {/* Mobile Quick Stats */}
          <div className="w-full max-w-xs">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 text-center">
                Quick Stats
              </h4>{" "}
              <div className="flex flex-col space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium capitalize ${
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
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium text-xs">
                    {dayjs(user.createdAt || user.joinedDate).fromNow()}
                  </span>
                </div>
                {user.userType === "staff" && user.totalSessions && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-medium">{user.totalSessions}</span>
                  </div>
                )}
                {user.userType === "staff" && user.approvedAt && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-600">Approved</span>
                    <span className="font-medium">
                      {dayjs(user.approvedAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                )}{" "}
                {user.userType === "staff" && user.rate && (
                  <div className="flex justify-between items-center py-0.5 mt-1">
                    <span className="text-gray-600">Rate</span>
                    <div className="inline-flex items-center px-2 py-0.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                      <FiDollarSign className="w-3 h-3 mr-1" />
                      <span>
                        {user.rate?.includes("/hour") ||
                        user.rate?.includes("/hr")
                          ? user.rate
                          : `${user.rate}/hr`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content Sections */}
      <div className="p-4 space-y-8 text-xs">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <h3
            className={`text-sm font-bold text-slate-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
          >
            <FiPhone
              className={`w-3.5 h-3.5 mr-2 text-${themeColor.primary}-600`}
            />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg group hover:bg-blue-100 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiMail className="w-4 h-4 text-blue-600" />
              </div>
              <span className="truncate text-slate-800 font-medium flex-1 text-sm">
                {user.email}
              </span>
              <button
                onClick={() => copyToClipboard(user.email, "email")}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-blue-200 relative"
                title="Copy email"
              >
                {copiedField === "email" ? (
                  <FiCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <FiCopy className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>

            {user.phone && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg group hover:bg-emerald-100 transition-colors">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FiPhone className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-slate-800 font-medium flex-1 text-sm">
                  {user.phone}
                </span>
                <button
                  onClick={() => copyToClipboard(user.phone!, "phone")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-emerald-200 relative"
                  title="Copy phone number"
                >
                  {copiedField === "phone" ? (
                    <FiCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <FiCopy className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Biography Section - Available for all users */}
        {user.bio && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h3
              className={`text-sm font-bold text-gray-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
            >
              <FiUser
                className={`w-3.5 h-3.5 mr-2 text-${themeColor.primary}-600`}
              />
              Biography
            </h3>
            <div className="px-3 pb-3">
              <p className="text-gray-700 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm shadow-sm">
                {user.bio}
              </p>
            </div>
          </div>
        )}

        {/* Social Links Section - Available for all users */}
        {(user.linkedinUrl ||
          user.websiteUrl ||
          (user.otherUrls && user.otherUrls.length > 0)) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h3
              className={`text-sm font-bold text-gray-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
            >
              <FiGlobe
                className={`w-3.5 h-3.5 mr-2 text-${themeColor.secondary}-600`}
              />
              Links & Resources
            </h3>
            <div className="px-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <FiLinkedin className="w-3 h-3" />
                    </div>
                    <span className="text-gray-800 font-medium text-xs">
                      LinkedIn
                    </span>
                    <FiExternalLink className="w-3 h-3 text-blue-600" />
                  </a>
                )}
                {user.websiteUrl && (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                  >
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white">
                      <FiGlobe className="w-3 h-3" />
                    </div>
                    <span className="text-gray-800 font-medium text-xs">
                      Website
                    </span>
                    <FiExternalLink className="w-3 h-3 text-purple-600" />
                  </a>
                )}
                {user.otherUrls && user.otherUrls.length > 0 && (
                  <>
                    {user.otherUrls.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white">
                          <FiLink className="w-3 h-3" />
                        </div>
                        <span className="text-gray-800 font-medium text-xs">
                          {new URL(url).hostname}
                        </span>
                        <FiExternalLink className="w-3 h-3 text-gray-600" />
                      </a>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expert-specific sections */}
        {user.userType === "staff" && (
          <>
            {user.advisoryTopics && user.advisoryTopics.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <h3
                  className={`text-sm font-bold text-gray-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
                >
                  <FiFileText
                    className={`w-3.5 h-3.5 mr-2 text-${themeColor.secondary}-600`}
                  />
                  Advisory Topics ({user.advisoryTopics.length})
                </h3>
                <div className="px-3 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {user.advisoryTopics
                      .slice(0, 6)
                      .map((topic: string, index: number) => (
                        <div
                          key={index}
                          className="inline-flex items-center w-fit px-3 py-1.5 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span>{topic}</span>
                        </div>
                      ))}
                    {user.advisoryTopics.length > 6 && (
                      <div className="w-full text-sm text-gray-600 py-1.5 text-center bg-gray-50 rounded-md border border-gray-200">
                        +{user.advisoryTopics.length - 6} more topics
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {user.expertiseAreas && user.expertiseAreas.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <h3
                  className={`text-sm font-bold text-gray-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
                >
                  <FiStar
                    className={`w-3.5 h-3.5 mr-2 text-${themeColor.primary}-600`}
                  />
                  Expertise Areas ({user.expertiseAreas.length})
                </h3>
                <div className="space-y-2 px-3 pb-3">
                  {user.expertiseAreas
                    .slice(0, 4)
                    .map((area: any, index: number) => (
                      <div
                        key={index}
                        className="relative p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            <span className="text-sm font-bold text-blue-900 tracking-wide">
                              {typeof area === "string"
                                ? area
                                : area.categoryName ||
                                  area.category ||
                                  "Category"}
                              {typeof area === "object" &&
                                area.subCategoryName && (
                                  <span className="text-indigo-700 font-normal">
                                    {" "}
                                    - {area.subCategoryName}
                                  </span>
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {user.expertiseAreas.length > 4 && (
                    <div className="text-sm text-gray-600 text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium">
                        +{user.expertiseAreas.length - 4} more expertise areas
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Expert Approval Actions */}
        {user.userType === "staff" && !user.isApproved && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h3
              className={`text-sm font-bold text-gray-900 mb-3 flex items-center ${themeColor.headingBorder} pl-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent py-1.5 rounded-r-lg`}
            >
              <FiUser
                className={`w-3.5 h-3.5 mr-2 text-${themeColor.primary}-600`}
              />
              Expert Approval
            </h3>
            <div className="px-3 pb-3">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveConfirm(true)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectConfirm(true)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-red-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiX className="w-4 h-4 mr-2 text-red-500" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
