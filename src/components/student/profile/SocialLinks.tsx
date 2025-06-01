import React from "react";
import { FiLink, FiPlus, FiX } from "react-icons/fi";

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
}) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addOtherUrl = () => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls: [...(prev.otherUrls || []), ""],
    }));
  };

  const updateOtherUrl = (index: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.map((url: string, i: number) =>
          i === index ? value : url,
        ) || [],
    }));
  };

  const removeOtherUrl = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.filter((_: string, i: number) => i !== index) || [],
    }));
  };

  return (
    <>
      {/* LinkedIn URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn URL
        </label>
        <div className="flex items-center">
          <FiLink className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="url"
            value={formData.linkedinUrl || ""}
            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <div className="flex items-center">
          <FiLink className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="url"
            value={formData.websiteUrl || ""}
            onChange={(e) => handleChange("websiteUrl", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Other Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Other Links
        </label>
        <div className="space-y-3">
          {(formData.otherUrls || []).map((url: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <FiLink className="h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => updateOtherUrl(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="https://other-link.com"
              />
              <button
                onClick={() => removeOtherUrl(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            onClick={addOtherUrl}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <FiPlus className="h-4 w-4 mr-1" /> Add another link
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialLinks;
