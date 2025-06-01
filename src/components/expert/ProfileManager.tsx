import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FiUser,
  FiPhone,
  FiLink,
  FiEdit3,
  FiCheck,
  FiX,
  FiCamera,
  FiSave,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";
import { profileService } from "../../api/services/profile.service";
import { userService } from "../../api/services/user.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { checkExpertProfileCompletion } from "../../utils/profileCompletion";
import ProfileCompletionIndicator from "../ui/ProfileCompletionIndicator";
import { ExpertiseArea, CategoriesResponse } from "../../types/expertise";

interface ExpertData {
  id?: string;
  username?: string;
  email?: string;
  userType?: "student" | "staff" | "admin";
  profileStatus?: { isComplete: boolean; missingFields: string[] };
  phone?: string;
  bio?: string;
  image?: string;
  rate?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  expertiseAreas?: ExpertiseArea[];
}

interface EditingSections {
  basicInfo: boolean;
  contact: boolean;
  socialLinks: boolean;
  profilePicture: boolean;
  professionalInfo: boolean;
  expertiseAreas: boolean;
}

interface APICategory {
  _id: string;
  name: string;
  description: string;
  subCategories: {
    _id: string;
    name: string;
    description: string;
  }[];
}

export function ExpertProfileManager() {
  const { user } = useAuth();
  const [expertData, setExpertData] = useState<ExpertData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingSections, setEditingSections] = useState<EditingSections>({
    basicInfo: false,
    contact: false,
    socialLinks: false,
    profilePicture: false,
    professionalInfo: false,
    expertiseAreas: false,
  });

  const [formData, setFormData] = useState<ExpertData>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Fetch expert data
  useEffect(() => {
    const fetchExpertData = async () => {
      if (!user?.userType || user.userType !== "staff") return;

      setIsLoading(true);
      try {
        const response = await userService.getCurrentUser(user.userType);
        const data = response.user;
        // Type conversion to ensure data conforms to ExpertData
        const expertDataFromApi: ExpertData = {
          ...data,
          // Include any specific expert fields that might need conversion
        };
        setExpertData(expertDataFromApi);
        setFormData(expertDataFromApi);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        showToast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpertData();
  }, [user]);

  // Fetch expertise categories
  const { data: categoriesResponse } = useQuery<CategoriesResponse>({
    queryKey: ["expertiseAreas"],
    queryFn: profileService.getExpertiseAreas,
  });

  const categories = categoriesResponse?.data;

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<ExpertData>) => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.updateStaffProfile(user.id, {
        phone: updatedData.phone || "", 
        bio: updatedData.bio || "",
        linkedinUrl: updatedData.linkedinUrl || "",
        websiteUrl: updatedData.websiteUrl || "",
        expertiseAreas: updatedData.expertiseAreas || [],
        rate: updatedData.rate || "",
        image: newImageFile || undefined, // Match the type in UpdateStaffProfileData interface
      });
    },
    onSuccess: (_, variables) => { // Use _ to ignore unused variable
      showToast.success("Profile updated successfully!");
      setExpertData((prev) => ({ ...prev, ...variables }));
      setEditingSections({
        basicInfo: false,
        contact: false,
        socialLinks: false,
        profilePicture: false,
        professionalInfo: false,
        expertiseAreas: false,
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
    setFormData(expertData);
    setNewImageFile(null);
  };

  const handleSave = (section: keyof EditingSections) => {
    if (section === "basicInfo") {
      if (!formData.bio?.trim() || formData.bio.length < 50) {
        showToast.error("Bio must be at least 50 characters long");
        return;
      }
    }

    if (section === "contact" && !formData.phone?.trim()) {
      showToast.error("Phone number is required");
      return;
    }

    if (section === "professionalInfo") {
      if (!formData.rate?.trim()) {
        showToast.error("Hourly rate is required");
        return;
      }
      const rate = parseFloat(String(formData.rate).replace(/[^0-9.]/g, ""));
      if (isNaN(rate) || rate <= 0) {
        showToast.error("Please enter a valid hourly rate");
        return;
      }
    }

    if (section === "expertiseAreas") {
      if (!formData.expertiseAreas || formData.expertiseAreas.length === 0) {
        showToast.error("Please select at least one area of expertise");
        return;
      }
    }

    updateProfileMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  const handleChange = (
    field: keyof ExpertData,
    value: string | ExpertiseArea[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpertiseChange = (categoryId: string, subCategoryId: string) => {
    setFormData((prev) => {
      const currentAreas = prev.expertiseAreas || [];
      const exists = currentAreas.some(
        (area) =>
          area.category === categoryId && area.subCategory === subCategoryId,
      );

      if (exists) {
        return {
          ...prev,
          expertiseAreas: currentAreas.filter(
            (area) =>
              !(
                area.category === categoryId &&
                area.subCategory === subCategoryId
              ),
          ),
        };
      }

      return {
        ...prev,
        expertiseAreas: [
          ...currentAreas,
          { category: categoryId, subCategory: subCategoryId },
        ],
      };
    });
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

  const profileCompletionStatus = expertData
    ? checkExpertProfileCompletion(expertData)
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
              Update your expert information step by step
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
              ) : expertData.image ? (
                <img
                  src={expertData.image}
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
                {expertData.image
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
                Professional Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Describe your professional experience, skills, and expertise..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio
            </label>
            <p className="text-gray-900">{expertData.bio || "Not provided"}</p>
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
                {expertData.phone || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Professional Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Professional Information
          </h2>
          {!editingSections.professionalInfo && (
            <button
              onClick={() => handleEdit("professionalInfo")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {editingSections.professionalInfo ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate (USD) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="number"
                  value={
                    formData.rate
                      ? String(formData.rate).replace(/[^0-9.]/g, "")
                      : ""
                  }
                  onChange={(e) => handleChange("rate", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                  placeholder="Enter your hourly rate"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("professionalInfo")}
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
                onClick={() => handleCancel("professionalInfo")}
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
              Hourly Rate
            </label>
            <div className="flex items-center">
              <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-gray-900">
                {expertData.rate || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Areas of Expertise Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Areas of Expertise
          </h2>
          {!editingSections.expertiseAreas && (
            <button
              onClick={() => handleEdit("expertiseAreas")}
              className="flex items-center gap-2 text-navy hover:text-navy/80 font-medium"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {editingSections.expertiseAreas ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose the areas you specialize in. You can select multiple
              categories and subcategories.
            </p>

            {categories && categories.length > 0 ? (
              <div className="space-y-6">
                {categories.map((category: APICategory) => (
                  <div
                    key={category._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="text-base font-semibold text-navy mb-2">
                      {category.name}
                      <span className="text-sm text-gray-600 font-normal block">
                        {category.description}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.subCategories.map((subCategory) => {
                        const isSelected = (formData.expertiseAreas || []).some(
                          (area) =>
                            area.category === category._id &&
                            area.subCategory === subCategory._id,
                        );

                        return (
                          <button
                            key={subCategory._id}
                            type="button"
                            onClick={() =>
                              handleExpertiseChange(
                                category._id,
                                subCategory._id,
                              )
                            }
                            className={`
                              flex items-center justify-between p-3 rounded-lg text-left border transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-navy text-white border-navy shadow-md"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-navy/30 hover:shadow-sm"
                              }
                            `}
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {subCategory.name}
                              </div>
                              <div
                                className={`text-xs mt-1 ${
                                  isSelected ? "text-gray-200" : "text-gray-500"
                                }`}
                              >
                                {subCategory.description}
                              </div>
                            </div>
                            {isSelected && (
                              <FiCheck className="h-4 w-4 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiAward className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Loading expertise areas...</p>
              </div>
            )}

            {(formData.expertiseAreas?.length || 0) === 0 && (
              <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                Please select at least one area of expertise to continue.
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave("expertiseAreas")}
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
                onClick={() => handleCancel("expertiseAreas")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {expertData.expertiseAreas &&
            expertData.expertiseAreas.length > 0 ? (
              <div className="space-y-4">
                {/* Group expertise areas by category */}
                {categories &&
                  expertData.expertiseAreas
                    .reduce((acc: any[], area) => {
                      const category = categories.find(
                        (cat: APICategory) => cat._id === area.category,
                      );
                      const subCategory = category?.subCategories.find(
                        (sub) => sub._id === area.subCategory,
                      );

                      if (category && subCategory) {
                        const existingCategory = acc.find(
                          (item) => item.categoryName === category.name,
                        );
                        if (existingCategory) {
                          existingCategory.subcategories.push(subCategory.name);
                        } else {
                          acc.push({
                            categoryName: category.name,
                            subcategories: [subCategory.name],
                          });
                        }
                      }
                      return acc;
                    }, [])
                    .map((categoryGroup, index) => (
                      <div key={index} className="space-y-2">
                        <div className="font-medium text-sm text-gray-600">
                          {categoryGroup.categoryName}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {categoryGroup.subcategories.map(
                            (subName: string, subIndex: number) => (
                              <span
                                key={subIndex}
                                className="px-3 py-1 bg-navy/10 text-navy rounded-full text-sm"
                              >
                                {subName}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <FiAward className="h-5 w-5 mr-3" />
                <p>No expertise areas selected</p>
              </div>
            )}
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
                  {expertData.linkedinUrl || "Not provided"}
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
                  {expertData.websiteUrl || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpertProfileManager;
