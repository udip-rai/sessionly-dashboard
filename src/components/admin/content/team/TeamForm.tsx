import { useRef } from "react";
import { FiUpload, FiImage, FiX } from "react-icons/fi";

export interface TeamFormProps {
  teamData: {
    name: string;
    title: string;
    image: string;
  };
  onChange: (teamData: { name: string; title: string; image: string }) => void;
  isEditing?: boolean;
  disabled?: boolean;
}

export const TeamForm = ({
  teamData,
  onChange,
  isEditing = false,
  disabled = false,
}: TeamFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      onChange({ ...teamData, name: value });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      onChange({ ...teamData, title: value });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll create a data URL. In production, you'd upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange({ ...teamData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange({ ...teamData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          value={teamData.name}
          onChange={handleNameChange}
          maxLength={100}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter team member's name..."
          autoFocus={!isEditing}
        />
        <p className="text-xs text-gray-500 mt-1">
          {teamData.name.length}/100 characters
        </p>
      </div>
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title/Position *
        </label>
        <input
          type="text"
          value={teamData.title}
          onChange={handleTitleChange}
          maxLength={100}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter job title or position..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {teamData.title.length}/100 characters
        </p>
      </div>{" "}
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        <div className="space-y-3">
          {teamData.image ? (
            <div className="relative inline-block">
              <img
                src={teamData.image}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={clearImage}
                disabled={disabled}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
              <FiImage className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={disabled}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUpload className="w-4 h-4 mr-2" />
              Choose Image
            </button>
            {teamData.image && (
              <button
                type="button"
                onClick={clearImage}
                disabled={disabled}
                className="text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Recommended: Square image, 200x200px or larger. Upload an image file
            from your computer.
          </p>
        </div>
      </div>
    </div>
  );
};
