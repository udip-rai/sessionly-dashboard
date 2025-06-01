import React from "react";
import { FiUser, FiCamera } from "react-icons/fi";

interface ProfilePictureProps {
  formData: {
    image?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  newImageFile: File | null;
  setNewImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  formData,
  newImageFile,
  setNewImageFile,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Profile Picture
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
            {newImageFile ? (
              <img
                src={URL.createObjectURL(newImageFile)}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : formData.image ? (
              <img
                src={formData.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <FiUser className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer hover:shadow-md transition-all duration-200">
            <FiCamera className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Upload a clear photo of yourself
        </p>
      </div>
    </div>
  );
};

export default ProfilePicture;
