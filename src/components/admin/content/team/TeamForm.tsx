import { useRef, useState, useEffect } from "react";
import {
  FiUpload,
  FiImage,
  FiX,
  FiPlus,
  FiLinkedin,
  FiGlobe,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface TeamFormProps {
  teamData: {
    name: string;
    title: string;
    description: string;
    image: string | File | null;
    socialLinks: SocialLink[];
  };
  onChange: (teamData: {
    name: string;
    title: string;
    description: string;
    image: string | File | null;
    socialLinks: SocialLink[];
  }) => void;
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
  const [imagePreview, setImagePreview] = useState<string>("");

  // Update image preview when teamData.image changes
  useEffect(() => {
    if (teamData.image instanceof File) {
      const url = URL.createObjectURL(teamData.image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof teamData.image === "string" && teamData.image) {
      setImagePreview(teamData.image);
    } else {
      setImagePreview("");
    }
  }, [teamData.image]);

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

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    if (value.length <= 500) {
      onChange({ ...teamData, description: value });
    }
  };

  const handleSocialLinkChange = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const updatedSocialLinks = [...teamData.socialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value,
    };
    onChange({ ...teamData, socialLinks: updatedSocialLinks });
  };

  const addSocialLink = () => {
    const newSocialLink: SocialLink = { platform: "LinkedIn", url: "" };
    onChange({
      ...teamData,
      socialLinks: [...teamData.socialLinks, newSocialLink],
    });
  };

  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = teamData.socialLinks.filter(
      (_, i) => i !== index,
    );
    onChange({ ...teamData, socialLinks: updatedSocialLinks });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FiLinkedin className="w-4 h-4" />;
      case "twitter":
        return <FiTwitter className="w-4 h-4" />;
      case "instagram":
        return <FiInstagram className="w-4 h-4" />;
      case "website":
        return <FiGlobe className="w-4 h-4" />;
      default:
        return <FiGlobe className="w-4 h-4" />;
    }
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the actual File object instead of converting to data URL
      onChange({ ...teamData, image: file });
    }
  };

  const clearImage = () => {
    onChange({ ...teamData, image: null });
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
        </label>{" "}
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
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
            {imagePreview && (
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
      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={teamData.description}
          onChange={handleDescriptionChange}
          maxLength={500}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter a brief description about the team member..."
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          {teamData.description.length}/500 characters
        </p>
      </div>
      {/* Social Links Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Social Links
          </label>
          <button
            type="button"
            onClick={addSocialLink}
            disabled={disabled}
            className="flex items-center px-2 py-1 text-sm font-medium text-navy bg-navy/10 border border-navy/20 rounded-lg hover:bg-navy/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add Link
          </button>
        </div>

        {teamData.socialLinks.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-lg bg-gray-50">
            No social links added yet. Click "Add Link" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {teamData.socialLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getSocialIcon(link.platform)}
                  <select
                    value={link.platform}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "platform", e.target.value)
                    }
                    disabled={disabled}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "url", e.target.value)
                  }
                  disabled={disabled}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={`Enter ${link.platform} URL...`}
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  disabled={disabled}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
