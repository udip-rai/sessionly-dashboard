import React from "react";
import { FiFile, FiUpload, FiFileText } from "react-icons/fi";
import { ProfileSectionProps } from "./types";

export const CVUpload: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          cv: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
          <FiFileText className="w-5 h-5 mr-3 text-orange-600" />
          CV/Resume
        </h2>
        <p className="text-gray-600 mb-4">
          Upload your professional CV or resume
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors relative bg-white">
        {formData.cv ? (
          <div className="flex items-center justify-center space-x-4">
            <FiFile className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">CV Uploaded</p>
              <p className="text-xs text-gray-500">Click to replace</p>
            </div>
          </div>
        ) : (
          <div>
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Upload your CV/Resume (PDF, DOC, DOCX)
            </p>
          </div>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCVUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
