import React from "react";
import { FiGlobe, FiLinkedin, FiPlus, FiX } from "react-icons/fi";
import { ProfileSectionProps, ExpertData } from "./_types";
import { InlineEditField } from "./InlineEditField";

interface SocialLinksProps extends ProfileSectionProps {
  originalData: ExpertData;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  formData,
  setFormData,
  editingField,
  setEditingField,
  originalData,
}) => {
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

  const handleAddUrl = () => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: [...prev.otherUrls, ""],
    }));
  };

  const handleUpdateUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const handleRemoveUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Primary Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InlineEditField
          field="linkedinUrl"
          value={formData.linkedinUrl}
          placeholder="LinkedIn URL"
          type="url"
          icon={FiLinkedin}
          editingField={editingField || null}
          setEditingField={setEditingField || (() => {})}
          onUpdate={handleInputChange}
          onCancel={handleCancel}
        />
        <InlineEditField
          field="websiteUrl"
          value={formData.websiteUrl}
          placeholder="Website URL"
          type="url"
          icon={FiGlobe}
          editingField={editingField || null}
          setEditingField={setEditingField || (() => {})}
          onUpdate={handleInputChange}
          onCancel={handleCancel}
        />
      </div>

      {/* Additional URLs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Additional Links
          </h3>
          <button
            onClick={handleAddUrl}
            className="flex items-center px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Link
          </button>
        </div>

        {formData.otherUrls.length > 0 && (
          <div className="space-y-3">
            {formData.otherUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUpdateUrl(index, e.target.value)}
                  placeholder="Enter URL (e.g., https://example.com)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove link"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.otherUrls.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No additional links added yet.</p>
            <button
              onClick={handleAddUrl}
              className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors mx-auto"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Your First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
