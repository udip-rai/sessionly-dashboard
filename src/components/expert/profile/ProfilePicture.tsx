import React from "react";
import { FiUser, FiCamera } from "react-icons/fi";
import { ProfileSectionProps } from "./types";

export const ProfilePicture: React.FC<ProfileSectionProps> = ({
  formData,
  setFormData,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        {formData.profilePicture ? (
          <img
            src={formData.profilePicture}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-blue-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
            <FiUser className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
          <FiCamera className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-sm text-gray-600 text-center">
        Click the camera icon to upload a new photo
      </p>
    </div>
  );
};
