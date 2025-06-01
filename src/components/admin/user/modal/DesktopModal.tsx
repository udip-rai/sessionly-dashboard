// filepath: c:\Users\udipr\Documents\career-2024\sessionlyco\Sessionly-Dashboard\src\components\admin\user\modal\DesktopModal.tsx
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
  FiAward,
  FiFile,
  FiDownload,
} from "react-icons/fi";

export const DesktopModal = ({
  user,
  handleImageClick,
  copiedField,
  handleApprove,
  handleReject,
  copyToClipboard,
}: {
  user: any;
  handleImageClick: () => void;
  copiedField: string | null;
  handleApprove: () => void;
  handleReject: () => void;
  copyToClipboard: (text: string, fieldName: string) => void;
}) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  if (!user) return null;

  // Determine the theme color based on user type
  const themeColor =
    user.userType === "staff"
      ? {
          primary: "blue",
          secondary: "indigo",
          headingBg: "from-blue-50",
          headingBorder: "border-blue-500",
        }
      : {
          primary: "purple",
          secondary: "pink",
          headingBg: "from-purple-50",
          headingBorder: "border-purple-500",
        };

  return (
    <div className="hidden lg:block">
      {/* Confirmation Modal for Approve */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-5 max-w-sm w-full border border-green-200 transform scale-100 animate-pulse">
            <h3
              className={`text-lg font-bold text-${themeColor.primary}-800 mb-3 flex items-center`}
            >
              <FiCheck className={`w-5 h-5 mr-2 text-green-600`} />
              Confirm Approval
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve {user.name || user.username}?
              This will grant them access to the platform as an expert.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleApprove();
                  setShowApproveConfirm(false);
                }}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200`}
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
          <div className="bg-white rounded-xl shadow-lg p-5 max-w-sm w-full border border-red-100 transform scale-100 animate-pulse">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <FiX className="w-5 h-5 mr-2 text-red-600" />
              Confirm Rejection
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {user.name || user.username}? They
              will be notified of this decision.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReject();
                  setShowRejectConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Profile & Stats */}
        <div className="col-span-4 p-3 border-r border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            {/* Profile Image */}
            <div className="w-44">
              <div className="group relative overflow-hidden rounded-lg bg-white shadow-md border border-gray-200 hover:border-blue-300 transition-all duration-500">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Flip Container */}
                <div className="relative w-full h-44 perspective-1000">
                  <div className="absolute inset-0 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      {user.profilePicture || user.image ? (
                        <div className="expert-image-container w-full h-full">
                          <img
                            src={user.profilePicture || user.image}
                            alt={user.name || user.username}
                            className="w-full h-full object-cover cursor-pointer expert-image-zoom"
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
                          {(user.name || user.username)
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      {/* Status Badge */}
                      <div
                        className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                          user.status === "active"
                            ? "bg-green-500"
                            : user.status === "inactive"
                            ? "bg-orange-400"
                            : "bg-red-500"
                        }`}
                        title={`Status: ${
                          user.status === "active"
                            ? "Active"
                            : user.status === "inactive"
                            ? "Inactive"
                            : "Blocked"
                        }`}
                      ></div>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center text-white p-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <h3 className="text-base font-bold">
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
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 mb-1">
                            <div className="flex items-center justify-center text-sm font-bold">
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
                            <FiStar className="w-3 h-3 text-yellow-300 fill-current" />
                            <span className="text-sm font-semibold">
                              {user.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="w-full">
              <div className="bg-gray-50 rounded-lg p-2.5 shadow-sm border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-1.5 pb-1 border-b border-gray-200">
                  Profile Summary
                </h4>
                <div className="flex flex-col space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span
                      className={`font-semibold capitalize ${
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
                    <span className="text-gray-500 font-medium">Joined</span>
                    <span className="font-semibold">
                      {dayjs(user.createdAt || user.joinedDate).format(
                        "MMM D, YYYY",
                      )}
                    </span>
                  </div>
                  {user.userType === "staff" &&
                    user.totalSessions !== undefined && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-gray-500 font-medium">
                          Sessions
                        </span>
                        <span className="font-semibold">
                          {user.totalSessions}
                        </span>
                      </div>
                    )}
                  {user.userType === "staff" && user.rating !== undefined && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-gray-500 font-medium">Rating</span>
                      <span className="font-semibold flex items-center">
                        {user.rating}
                        <FiStar className="w-3 h-3 text-yellow-400 ml-0.5 inline fill-current" />
                      </span>
                    </div>
                  )}
                  {user.userType === "staff" && user.approvedAt && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-gray-500 font-medium">
                        Approved
                      </span>
                      <span className="font-semibold">
                        {dayjs(user.approvedAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                  )}
                  {user.timezone && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-gray-500 font-medium">
                        Timezone
                      </span>
                      <span className="font-semibold">{user.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            {user.userType === "staff" && !user.isApproved && (
              <div className="w-full mt-3 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                  Expert Approval
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApproveConfirm(true)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-sm"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(true)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 shadow-sm"
                  >
                    <FiX className="w-4 h-4 mr-2 text-red-500" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div
          className="col-span-8 py-3 pr-4 overflow-y-auto max-h-[calc(90vh-180px)]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(100, 116, 139, 0.5) rgba(241, 245, 249, 0.1)",
          }}
        >
          <div className="space-y-6">
            {/* Contact Information at top right */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <h3
                className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent`}
              >
                <FiPhone
                  className={`w-4 h-4 mr-2 text-${themeColor.primary}-600`}
                />
                Contact Information
              </h3>
              <div className="p-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg group hover:bg-blue-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiMail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="truncate text-slate-800 font-medium flex-1 text-sm">
                      {user.email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(user.email, "email")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-blue-200"
                      title="Copy email"
                    >
                      {copiedField === "email" ? (
                        <FiCheck className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <FiCopy className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  </div>

                  {/* Phone */}
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-emerald-200"
                        title="Copy phone number"
                      >
                        {copiedField === "phone" ? (
                          <FiCheck className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <h3
                  className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent`}
                >
                  <FiUser
                    className={`w-4 h-4 mr-2 text-${themeColor.primary}-600`}
                  />
                  Biography
                </h3>
                <div className="p-3">
                  <p className="text-gray-700 text-sm leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                    {user.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Expertise Areas */}
            {user.userType === "staff" &&
              user.expertiseAreas &&
              user.expertiseAreas.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <h3
                    className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent`}
                  >
                    <FiStar
                      className={`w-4 h-4 mr-2 text-${themeColor.primary}-600`}
                    />
                    Expertise Areas ({user.expertiseAreas.length})
                  </h3>
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-3">
                      {user.expertiseAreas.map((area: any, index: number) => (
                        <div
                          key={index}
                          className="p-2 bg-blue-50 border border-blue-100 rounded-lg"
                        >
                          <div className="inline-flex items-center px-2 py-1 bg-blue-100 border border-blue-200 rounded-md shadow-sm mb-1">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1"></div>
                            <span className="text-xs font-bold text-blue-900">
                              {typeof area === "string"
                                ? area
                                : area.categoryName ||
                                  area.category ||
                                  "Category"}
                            </span>
                          </div>
                          {typeof area === "object" && area.subCategoryName && (
                            <div className="text-xs font-medium text-gray-700 ml-2 mt-1">
                              {area.subCategoryName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Advisory Topics */}
            {user.userType === "staff" &&
              user.advisoryTopics &&
              user.advisoryTopics.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <h3
                    className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r from-green-50 to-transparent`}
                  >
                    <FiFileText className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Advisory Topics ({user.advisoryTopics.length})
                  </h3>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {user.advisoryTopics.map(
                        (topic: string, index: number) => (
                          <div
                            key={index}
                            className="inline-flex items-center w-fit px-3 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            <span>{topic}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Links Section */}
            {(user.linkedinUrl ||
              user.websiteUrl ||
              (user.otherUrls && user.otherUrls.length > 0)) && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <h3
                  className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r from-${themeColor.secondary}-50 to-transparent`}
                >
                  <FiGlobe
                    className={`w-3.5 h-3.5 mr-1.5 text-${themeColor.secondary}-600`}
                  />
                  Links & Resources
                </h3>
                <div className="p-3">
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
                          LinkedIn Profile
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
                          Personal Website
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

            {/* Additional Expert Information */}
            {user.userType === "staff" && (
              <>
                {user.certificates && user.certificates.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <h3
                      className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r ${themeColor.headingBg} to-transparent`}
                    >
                      <FiAward
                        className={`w-3.5 h-3.5 mr-1.5 text-${themeColor.primary}-600`}
                      />
                      Certificates ({user.certificates.length})
                    </h3>
                    <div className="p-2 space-y-1.5">
                      {user.certificates.map((cert: any, index: number) => (
                        <div
                          key={index}
                          className="bg-yellow-50 border border-yellow-100 rounded-md p-2"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-xs">
                              {cert.name}
                            </span>
                            {cert.issueDate && (
                              <span className="text-xs text-gray-500">
                                {new Date(cert.issueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {cert.description && (
                            <p className="text-xs text-gray-600">
                              {cert.description}
                            </p>
                          )}
                          {cert.fileUrl && (
                            <a
                              href={cert.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                            >
                              <FiFile className="w-3 h-3 mr-1" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {user.cv && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <h3
                      className={`text-sm font-bold text-gray-900 flex items-center border-b border-gray-200 px-3 py-2 bg-gradient-to-r from-${themeColor.secondary}-50 to-transparent`}
                    >
                      <FiFileText
                        className={`w-3.5 h-3.5 mr-1.5 text-${themeColor.secondary}-600`}
                      />
                      Curriculum Vitae
                    </h3>
                    <div className="p-3">
                      <a
                        href={user.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-all text-xs font-medium"
                      >
                        <FiDownload className="w-3 h-3 mr-1.5" />
                        Download CV
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
