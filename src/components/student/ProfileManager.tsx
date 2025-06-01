import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FiUser,
  FiPhone,
  FiLink,
  FiEdit3,
  FiCheck,
  FiX,
  FiCamera,
  FiSave,
} from "react-icons/fi";
import { studentService } from "../../api/services/student.service";
import { userService } from "../../api/services/user.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { checkStudentProfileCompletion } from "../../utils/profileCompletion";
import ProfileCompletionIndicator from "../ui/ProfileCompletionIndicator";

interface StudentData {
  username?: string;
  phone?: string;
  bio?: string;
  image?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
}

interface EditingSections {
  basicInfo: boolean;
  contact: boolean;
  socialLinks: boolean;
  profilePicture: boolean;
}

export function StudentProfileManager() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingSections, setEditingSections] = useState<EditingSections>({
    basicInfo: false,
    contact: false,
    socialLinks: false,
    profilePicture: false,
  });

  const [formData, setFormData] = useState<StudentData>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.userType || user.userType !== "student") return;

      setIsLoading(true);
      try {
        const response = await userService.getCurrentUser(user.userType);
        const data = response.user;
        setStudentData(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        showToast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<StudentData>) => {
      if (!user?.id) throw new Error("User ID not found");
      
      // Since the API expects non-optional fields, ensure we provide default values
      return studentService.updateStudentProfile(user.id, {
        username: updatedData.username || "", 
        phone: updatedData.phone || "",
        bio: updatedData.bio || "",
        linkedinUrl: updatedData.linkedinUrl || "",
        websiteUrl: updatedData.websiteUrl || "",
        image: newImageFile, 
        otherUrls: updatedData.otherUrls?.filter((url) => url.trim() !== "") || [],
      });
    },
    onSuccess: (_, variables) => { // Replace 'response' with '_' to avoid unused variable
      showToast.success("Profile updated successfully!");
      setStudentData((prev) => ({ ...prev, ...variables }));
      setEditingSections({
        basicInfo: false,
        contact: false,
        socialLinks: false,
        profilePicture: false,
      });
      setNewImageFile(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      showToast.error(errorMessage);
    },
  });

  const handleEdit = (section: keyof EditingSections) => {
    setEditingSections((prev) => ({ ...prev, [section]: true }));
  };

  const handleCancel = (section: keyof EditingSections) => {
    setEditingSections((prev) => ({ ...prev, [section]: false }));
    setFormData(studentData);
    setNewImageFile(null);
  };

  const handleSave = (section: keyof EditingSections) => {
    if (section === "basicInfo") {
      if (!formData.username?.trim()) {
        showToast.error("Username is required");
        return;
      }
      if (!formData.bio?.trim() || formData.bio.length < 50) {
        showToast.error("Bio must be at least 50 characters long");
        return;
      }
    }

    if (section === "contact" && !formData.phone?.trim()) {
      showToast.error("Phone number is required");
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  const handleChange = (field: keyof StudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addOtherUrl = () => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: [...(prev.otherUrls || []), ""],
    }));
  };

  const updateOtherUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.map((url, i) => (i === index ? value : url)) || [],
    }));
  };

  const removeOtherUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileCompletionStatus = studentData
    ? checkStudentProfileCompletion(studentData)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Completion Indicator */}
      {profileCompletionStatus && (
        <ProfileCompletionIndicator
          status={profileCompletionStatus}
          className="shadow-sm"
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Profile Management
            </h1>
            <p className="text-gray-600 mt-1">
              Update your information step by step
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiEdit3 className="h-4 w-4" />
            Click any section to edit
          </div>
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
          {!editingSections.profilePicture && (
            <button
              onClick={() => handleEdit("profilePicture")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
              {newImageFile ? (
                <img
                  src={URL.createObjectURL(newImageFile)}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : studentData.image ? (
                <img
                  src={studentData.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <FiUser className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            {editingSections.profilePicture && (
              <label className="absolute -bottom-2 -right-2 bg-navy text-white p-2 rounded-full cursor-pointer hover:bg-navy/90">
                <FiCamera className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {editingSections.profilePicture ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("profilePicture")}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FiCheck className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => handleCancel("profilePicture")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                {studentData.image
                  ? "Profile picture uploaded"
                  : "No profile picture uploaded"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Basic Information
          </h2>
          {!editingSections.basicInfo && (
            <button
              onClick={() => handleEdit("basicInfo")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {editingSections.basicInfo ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username || ""}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("basicInfo")}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                Save
              </button>
              <button
                onClick={() => handleCancel("basicInfo")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <p className="text-gray-900">
                {studentData.username || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <p className="text-gray-900">
                {studentData.bio || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Contact Information
          </h2>
          {!editingSections.contact && (
            <button
              onClick={() => handleEdit("contact")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {editingSections.contact ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("contact")}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                Save
              </button>
              <button
                onClick={() => handleCancel("contact")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center">
              <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-gray-900">
                {studentData.phone || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Social Links</h2>
          {!editingSections.socialLinks && (
            <button
              onClick={() => handleEdit("socialLinks")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {editingSections.socialLinks ? (
          <div className="space-y-4">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Links
              </label>
              <div className="space-y-2">
                {(formData.otherUrls || []).map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FiLink className="h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateOtherUrl(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                      placeholder="https://other-link.com"
                    />
                    <button
                      onClick={() => removeOtherUrl(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOtherUrl}
                  className="text-navy hover:text-navy/80 text-sm font-medium"
                >
                  + Add another link
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("socialLinks")}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                Save
              </button>
              <button
                onClick={() => handleCancel("socialLinks")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <div className="flex items-center">
                <FiLink className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-gray-900">
                  {studentData.linkedinUrl || "Not provided"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <div className="flex items-center">
                <FiLink className="h-5 w-5 text-gray-400 mr-3" />
                <p className="text-gray-900">
                  {studentData.websiteUrl || "Not provided"}
                </p>
              </div>
            </div>
            {studentData.otherUrls && studentData.otherUrls.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Links
                </label>
                <div className="space-y-1">
                  {studentData.otherUrls.map((url, index) => (
                    <div key={index} className="flex items-center">
                      <FiLink className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-gray-900">{url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfileManager;
