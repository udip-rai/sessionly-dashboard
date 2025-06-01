import React from "react";
import { FiFile, FiUpload } from "react-icons/fi";
import { ProfileSectionProps } from "./_types";

export const CVUpload: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Debug logging
      console.log("[CVUpload] File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log(
          "[CVUpload] Base64 result:",
          result.substring(0, 100) + "...",
        );

        setFormData((prev) => ({
          ...prev,
          cv: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors relative">
      {formData.cv &&
      typeof formData.cv === "string" &&
      formData.cv.trim() !== "" ? (
        <div className="flex items-center justify-center space-x-4">
          <FiFile className="w-8 h-8 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">CV Uploaded</p>
            <p className="text-xs text-gray-500">Click to replace</p>
            <p className="text-xs text-blue-500">
              {formData.cv.startsWith("data:")
                ? "Base64 file ready"
                : "File URL ready"}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Upload your CV/Resume (PDF Only)
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
  );
};
