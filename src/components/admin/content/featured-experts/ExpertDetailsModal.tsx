import {
  FiUser,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGlobe,
  FiTag,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { FeaturedExpert } from "../../../../api/services/admin.service";
import { Modal } from "../../../ui";

interface ExpertDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: FeaturedExpert | null;
  onToggleFeatured: (expertId: string, currentStatus: boolean) => void;
  updating: boolean;
}

export function ExpertDetailsModal({
  isOpen,
  onClose,
  expert,
  onToggleFeatured,
  updating,
}: ExpertDetailsModalProps) {
  if (!expert) return null;

  const handleToggleFeatured = () => {
    onToggleFeatured(expert._id, expert.isFeatured);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Expert Details">
      <div className="space-y-6">
        {/* Expert Header */}
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
            <h2 className="text-xl font-bold text-gray-900">
              {expert.username}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
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
                  expert.isApproved
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {expert.isApproved ? (
                  <FiCheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <FiClock className="w-3 h-3 mr-1" />
                )}
                {expert.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
          </div>
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
            )}
            <div className="flex items-center space-x-3">
              <FiTag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-medium text-green-600">{expert.rate}</p>
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
        )}

        {/* Expertise Areas */}
        {expert.expertiseAreas && expert.expertiseAreas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expertise Areas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expert.expertiseAreas.map((area) => (
                <div
                  key={area._id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <p className="font-medium text-blue-900">
                    {area.categoryName}
                  </p>
                  <p className="text-sm text-blue-700">
                    {area.subCategoryName}
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
              {expert.advisoryTopics.map((topic, index) => (
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
        )}

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FiCheckCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email Status</p>
                <p
                  className={`font-medium ${
                    expert.emailVerified ? "text-green-600" : "text-red-600"
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
      </div>
    </Modal>
  );
}
