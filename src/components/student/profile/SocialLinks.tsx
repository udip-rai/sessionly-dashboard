import React from "react";
import {
  FiGlobe,
  FiLinkedin,
  FiPlus,
  FiX,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";

interface SocialLinksProps {
  formData: {
    linkedinUrl?: string;
    websiteUrl?: string;
    otherUrls?: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  originalData: {
    linkedinUrl?: string;
    websiteUrl?: string;
    otherUrls?: string[];
  };
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  formData,
  setFormData,
  editingField,
  setEditingField,
  originalData,
}) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: originalData[field as keyof typeof originalData],
    }));
  };

  const handleAddUrl = () => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls: [...(prev.otherUrls || []), ""],
    }));
  };

  const handleUpdateUrl = (index: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.map((url: string, i: number) =>
          i === index ? value : url,
        ) || [],
    }));
  };

  const handleRemoveUrl = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.filter((_: string, i: number) => i !== index) || [],
    }));
  };

  // Inline edit field component
  const InlineEditField: React.FC<{
    field: string;
    value: string;
    placeholder: string;
    icon: React.ComponentType<any>;
    type?: string;
  }> = ({ field, value, placeholder, icon: Icon, type = "text" }) => {
    const isEditing = editingField === field;

    const handleFieldEdit = () => {
      setEditingField(field);
    };

    const handleFieldSave = () => {
      setEditingField(null);
    };

    const handleFieldCancel = () => {
      handleCancel(field);
      setEditingField(null);
    };

    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Icon className="inline mr-2" />
          {placeholder}
        </label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="flex-1 px-3 py-2 border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder={placeholder}
              autoFocus
            />
            <button
              onClick={handleFieldSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={handleFieldCancel}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={handleFieldEdit}
            className="group cursor-pointer p-3 border border-transparent rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 relative"
          >
            <p className={`${value ? "text-gray-900" : "text-gray-400"}`}>
              {value || `Click to add ${placeholder.toLowerCase()}`}
            </p>
            <FiEdit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3 transition-opacity" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Primary Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InlineEditField
          field="linkedinUrl"
          value={formData.linkedinUrl || ""}
          placeholder="LinkedIn URL"
          type="url"
          icon={FiLinkedin}
        />
        <InlineEditField
          field="websiteUrl"
          value={formData.websiteUrl || ""}
          placeholder="Website URL"
          type="url"
          icon={FiGlobe}
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

        {(formData.otherUrls || []).length > 0 && (
          <div className="space-y-3">
            {(formData.otherUrls || []).map((url: string, index: number) => (
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

        {(formData.otherUrls || []).length === 0 && (
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

export default SocialLinks;
