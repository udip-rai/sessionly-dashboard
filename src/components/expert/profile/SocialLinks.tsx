import React, { useState } from "react";
import { FiGlobe, FiLinkedin, FiPlus, FiX, FiTag } from "react-icons/fi";
import { ProfileSectionProps, ExpertData } from "./types";
import { InlineEditField } from "./InlineEditField";

interface SocialLinksProps extends ProfileSectionProps {
  originalData: ExpertData;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  formData,
  setFormData,
  editingField = null,
  setEditingField,
  originalData,
}) => {
  const [newOtherUrl, setNewOtherUrl] = useState("");
  const [newAdvisoryTopic, setNewAdvisoryTopic] = useState("");

  const handleInputChange = (field: keyof ExpertData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = (field: keyof ExpertData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: originalData[field],
    }));
  };

  const handleAddOtherUrl = () => {
    if (newOtherUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        otherUrls: [...prev.otherUrls, newOtherUrl.trim()],
      }));
      setNewOtherUrl("");
    }
  };

  const handleRemoveOtherUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls.filter((_, i) => i !== index),
    }));
  };

  const handleAddAdvisoryTopic = () => {
    if (newAdvisoryTopic.trim()) {
      setFormData((prev) => ({
        ...prev,
        advisoryTopics: [...prev.advisoryTopics, newAdvisoryTopic.trim()],
      }));
      setNewAdvisoryTopic("");
    }
  };

  const handleRemoveAdvisoryTopic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      advisoryTopics: prev.advisoryTopics.filter((_, i) => i !== index),
    }));
  };

  if (!setEditingField) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Social Links Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiLinkedin className="w-5 h-5 mr-3 text-blue-600" />
          Social Links
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Professional and personal web presence
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-blue-50/30 p-4 rounded-lg">
          <InlineEditField
            field="linkedinUrl"
            value={formData.linkedinUrl}
            placeholder="LinkedIn URL"
            type="url"
            icon={FiLinkedin}
            editingField={editingField}
            setEditingField={setEditingField}
            onUpdate={handleInputChange}
            onCancel={handleCancel}
          />
          <InlineEditField
            field="websiteUrl"
            value={formData.websiteUrl}
            placeholder="Website URL"
            type="url"
            icon={FiGlobe}
            editingField={editingField}
            setEditingField={setEditingField}
            onUpdate={handleInputChange}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Additional URLs Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiGlobe className="w-5 h-5 mr-3 text-cyan-600" />
          Additional URLs
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Other relevant websites and resources
        </p>

        <div className="bg-cyan-50/30 p-4 rounded-lg">
          <div className="space-y-4">
            {formData.otherUrls.length > 0 && (
              <div className="space-y-2">
                {formData.otherUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 flex-1 truncate mr-3">
                      {url}
                    </span>
                    <button
                      onClick={() => handleRemoveOtherUrl(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={newOtherUrl}
                onChange={(e) => setNewOtherUrl(e.target.value)}
                placeholder="Add other URL..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleAddOtherUrl()}
              />
              <button
                onClick={handleAddOtherUrl}
                disabled={!newOtherUrl.trim()}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                <span className="flex items-center">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add URL
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Topics Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiTag className="w-5 h-5 mr-3 text-purple-600" />
          Advisory Topics
        </h2>
        <p className="text-gray-600 mb-4 text-sm">Topics you can advise on</p>

        <div className="bg-purple-50/30 p-4 rounded-lg">
          <div className="space-y-4">
            {formData.advisoryTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.advisoryTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm group"
                  >
                    <span className="mr-2">{topic}</span>
                    <button
                      onClick={() => handleRemoveAdvisoryTopic(index)}
                      className="text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newAdvisoryTopic}
                onChange={(e) => setNewAdvisoryTopic(e.target.value)}
                placeholder="Add advisory topic..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) =>
                  e.key === "Enter" && handleAddAdvisoryTopic()
                }
              />
              <button
                onClick={handleAddAdvisoryTopic}
                disabled={!newAdvisoryTopic.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                <span className="flex items-center">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Topic
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
