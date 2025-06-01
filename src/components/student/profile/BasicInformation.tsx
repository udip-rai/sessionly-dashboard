import React from "react";

interface BasicInformationProps {
  formData: {
    username?: string;
    bio?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  originalData: {
    username?: string;
    bio?: string;
  };
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Basic Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Tell us about yourself, your interests, and your goals..."
          />
          <div className="flex justify-between items-center mt-1">
            <span
              className={`text-xs ${
                (formData.bio?.length || 0) < 50
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {formData.bio?.length || 0}/500{" "}
              {(formData.bio?.length || 0) < 50 && "(min 50)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
