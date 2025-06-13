import { useState, useEffect } from "react";
import {
  FiStar,
  FiUser,
  FiEye,
  FiRefreshCw,
  FiUsers,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGlobe,
  FiTag,
  FiToggleLeft,
  FiToggleRight,
  FiCalendar,
} from "react-icons/fi";
import { adminService, Staff } from "../../../api/services/admin.service";
import { toast } from "../../toast";
import { Modal } from "../../ui";

export function TabFeaturedExperts() {
  const [experts, setExperts] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<string | null>(null);
  // Modal states
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [selectedExpert, setSelectedExpert] = useState<Staff | null>(null);

  // Fetch all experts (staff)
  const loadExperts = async () => {
    try {
      setLoading(true);
      const allExperts = await adminService.getAllExperts();
      setExperts(allExperts);
    } catch (error: any) {
      console.error("Failed to load experts:", error);
      toast.error(
        "Failed to load experts: " +
          (error?.response?.data?.message || error?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadExperts();
  }, []);

  // Handle view expert details
  const handleViewExpert = (expert: Staff) => {
    setSelectedExpert(expert);
    setShowExpertModal(true);
  };

  const handleCloseExpertModal = () => {
    setSelectedExpert(null);
    setShowExpertModal(false);
  };
  // Toggle featured status
  const handleToggleFeatured = async (
    expertId: string,
    currentStatus: boolean,
  ) => {
    try {
      setUpdating(expertId);
      await adminService.updateExpertFeaturedStatus(expertId, !currentStatus);

      // Update local state
      setExperts((prev) =>
        prev.map((expert) =>
          expert._id === expertId
            ? { ...expert, isFeatured: !currentStatus }
            : expert,
        ),
      );

      // Update selected expert if it's the one being modified
      if (selectedExpert && selectedExpert._id === expertId) {
        setSelectedExpert((prev) =>
          prev ? { ...prev, isFeatured: !currentStatus } : prev,
        );
      }

      toast.success(
        `Expert ${!currentStatus ? "featured" : "unfeatured"} successfully`,
      );
    } catch (error: any) {
      console.error("Failed to update featured status:", error);
      toast.error("Failed to update featured status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading featured experts...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we fetch the data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Featured Experts Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage featured experts displayed on your platform
          </p>
        </div>{" "}
        <button
          onClick={loadExperts}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <FiStar className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Featured Experts
              </p>{" "}
              <p className="text-2xl font-bold text-yellow-900">
                {experts.filter((expert) => expert.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <FiUsers className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Total Experts</p>
              <p className="text-2xl font-bold text-blue-900">
                {experts.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <FiUser className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Approved Experts
              </p>
              <p className="text-2xl font-bold text-green-900">
                {experts.filter((expert) => expert.isApproved).length}
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Experts Grid */}
      {experts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {" "}
          {experts.map((expert) => (
            <div
              key={expert._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
            >
              {/* Expert Image */}
              <div
                className="relative h-32 flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                  backgroundImage: expert.image
                    ? `url(${expert.image})`
                    : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: expert.image ? "blur(0px)" : "none",
                }}
              >
                {/* Blurred background overlay */}
                {expert.image && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${expert.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(8px) brightness(0.85)",
                      transform: "scale(1.1)", // Slightly larger to avoid blur edges
                    }}
                  />
                )}

                {/* Semi-transparent overlay for better contrast */}
                <div className="absolute inset-0 bg-black/20" />

                {expert.image ? (
                  <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg">
                    <img
                      src={expert.image}
                      alt={expert.username}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                )}

                {/* Featured badge */}
                {expert.isFeatured && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <FiStar className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Expert Info */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Name and Email - Fixed height */}
                <div className="mb-3 min-h-[60px]">
                  <h3
                    className="text-sm font-semibold text-gray-900 mb-1 truncate"
                    title={expert.username || expert.email}
                  >
                    {expert.username || expert.email}
                  </h3>
                  <p
                    className="text-gray-600 text-xs truncate"
                    title={expert.email}
                  >
                    {expert.email}
                  </p>
                  {/* Rate - Always show, with fallback */}
                  <p className="text-green-600 text-xs font-medium mt-1">
                    {expert.rate || "Rate not set"}
                  </p>
                </div>

                {/* Status indicators - Fixed height */}
                <div className="mb-3 min-h-[28px] flex items-start">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      expert.emailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FiMail
                      className={`w-3 h-3 mr-1 flex-shrink-0 ${
                        expert.emailVerified
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="truncate">
                      {expert.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </span>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleViewExpert(expert)}
                    className="w-full flex items-center justify-center px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <FiEye className="w-3 h-3 mr-1 flex-shrink-0" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiStar className="w-8 h-8 text-gray-400" />
          </div>{" "}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No experts found
          </h3>
          <p className="text-gray-600">
            No experts are currently available in the system.
          </p>
        </div>
      )}{" "}
      {/* Expert Details Modal */}
      <ExpertDetailsModal
        isOpen={showExpertModal}
        onClose={handleCloseExpertModal}
        expert={selectedExpert}
        onToggleFeatured={handleToggleFeatured}
        updating={updating === selectedExpert?._id}
      />
    </div>
  );
}

// Expert Details Modal Component
interface ExpertDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Staff | null;
  onToggleFeatured: (expertId: string, currentStatus: boolean) => void;
  updating: boolean;
}

function ExpertDetailsModal({
  isOpen,
  onClose,
  expert,
  onToggleFeatured,
  updating,
}: ExpertDetailsModalProps) {
  if (!expert) return null;
  const handleToggleFeatured = () => {
    onToggleFeatured(expert._id, expert.isFeatured || false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Expert Details">
      <div className="space-y-6">
        {/* Expert Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {expert.image ? (
                <img
                  src={expert.image}
                  alt={expert.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {expert.username || expert.email}
              </h2>
              <div className="flex items-center space-x-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    expert.isFeatured
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <FiStar
                    className={`w-3 h-3 mr-1 ${
                      expert.isFeatured ? "text-yellow-600" : "text-gray-400"
                    }`}
                  />
                  {expert.isFeatured ? "Featured" : "Not Featured"}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    expert.emailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiMail
                    className={`w-3 h-3 mr-1 ${
                      expert.emailVerified ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  {expert.emailVerified ? "Verified" : "Unverified"}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FiTag className="w-3 h-3 mr-1 text-green-600" />
                  {expert.rate || "Rate not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Feature/Unfeature Button - Moved to top right */}
          <button
            onClick={handleToggleFeatured}
            disabled={updating}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              expert.isFeatured
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {updating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : expert.isFeatured ? (
              <FiToggleRight className="w-4 h-4 mr-2" />
            ) : (
              <FiToggleLeft className="w-4 h-4 mr-2" />
            )}
            {expert.isFeatured ? "Unfeature Expert" : "Feature Expert"}
          </button>
        </div>
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{expert.email}</p>
              </div>
            </div>
            {expert.phone && (
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{expert.phone}</p>
                </div>
              </div>
            )}{" "}
            <div className="flex items-center space-x-3">
              <FiTag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-medium text-green-600">
                  {expert.rate || "Rate not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Expert ID</p>
                <p className="font-medium text-gray-900 text-xs">
                  {expert._id}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bio */}
        {expert.bio && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Biography
            </h3>
            <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
          </div>
        )}{" "}
        {/* Expertise Areas */}
        {expert.expertiseAreas && expert.expertiseAreas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expertise Areas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expert.expertiseAreas.map((area: any) => (
                <div
                  key={area._id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <p className="font-medium text-blue-900">
                    {area.categoryName || area.category}
                  </p>
                  <p className="text-sm text-blue-700">
                    {area.subCategoryName || area.subCategory}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Advisory Topics */}
        {expert.advisoryTopics && expert.advisoryTopics.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Advisory Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {expert.advisoryTopics.map((topic: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Social Links */}
        {(expert.linkedinUrl || expert.websiteUrl) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Social Links
            </h3>
            <div className="flex space-x-4">
              {expert.linkedinUrl && (
                <a
                  href={expert.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                >
                  <FiLinkedin className="w-5 h-5 mr-2" />
                  LinkedIn Profile
                </a>
              )}
              {expert.websiteUrl && (
                <a
                  href={expert.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                >
                  <FiGlobe className="w-5 h-5 mr-2" />
                  Website
                </a>
              )}
            </div>
          </div>
        )}{" "}
        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FiMail
                className={`w-5 h-5 ${
                  expert.emailVerified ? "text-green-500" : "text-gray-400"
                }`}
              />
              <div>
                <p className="text-sm text-gray-600">Email Verification</p>
                <p
                  className={`font-medium ${
                    expert.emailVerified ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {expert.emailVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiTag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">User Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {expert.userType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
