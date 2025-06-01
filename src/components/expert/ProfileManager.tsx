import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../api/services/user.service";
import { profileService } from "../../api/services/profile.service";
import { showToast } from "../../utils/toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiGlobe,
  FiLinkedin,
  FiSave,
  FiCamera,
  FiEdit2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiFileText,
  FiStar,
  FiUpload,
  FiFile,
  FiAward,
  FiPlus,
  FiFacebook,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { ExpertiseArea, Category } from "../../types/expertise";

interface SocialUrl {
  id: string;
  platform: string;
  url: string;
  label: string;
}

interface ExpertData {
<<<<<<< HEAD
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  rate: string;
  profilePicture: string;
  linkedinUrl: string;
  websiteUrl: string;
  socialUrls: SocialUrl[];
  expertiseAreas: ExpertiseArea[];
  cv: string | null;
  certificates: Array<{
=======
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
>>>>>>> dev
    name: string;
    file: string | null;
    issueDate: string;
    description: string;
  }>;
}

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return FiLinkedin;
    case "facebook":
      return FiFacebook;
    case "whatsapp":
      return FaWhatsapp;
    case "instagram":
      return FaInstagram;
    case "twitter":
    case "x":
      return FaTwitter;
    case "youtube":
      return FaYoutube;
    case "tiktok":
      return FaTiktok;
    default:
      return FiGlobe;
  }
};

// Helper function to get platform color
const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return "text-blue-600";
    case "facebook":
      return "text-blue-500";
    case "whatsapp":
      return "text-green-500";
    case "instagram":
      return "text-pink-500";
    case "twitter":
    case "x":
      return "text-blue-400";
    case "youtube":
      return "text-red-500";
    case "tiktok":
      return "text-black";
    default:
      return "text-gray-600";
  }
};

export const ExpertProfileManager: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expertData, setExpertData] = useState<ExpertData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    rate: "",
    profilePicture: "",
    linkedinUrl: "",
    websiteUrl: "",
    socialUrls: [],
    expertiseAreas: [],
    cv: null,
    certificates: [],
  });

  const [formData, setFormData] = useState<ExpertData>(expertData);

  // Fetch categories and expert data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userType || user.userType !== "staff") return;

      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await profileService.getExpertiseAreas();
        setCategories(categoriesResponse.data);

        // Fetch user data
        const response = await userService.getCurrentUser(user.userType);
<<<<<<< HEAD
        const userData = response.user;

        // Sample data (in real app, get from API)
        const sampleData: ExpertData = {
          email: userData.email || "john.expert@sessionly.com",
          firstName: userData.username?.split(" ")[0] || "John",
          lastName: userData.username?.split(" ")[1] || "Expert",
          phone: "+1 (555) 123-4567",
          bio: "Experienced software engineer with 10+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about mentoring and helping others grow in their technical careers.",
          rate: "75",
          linkedinUrl: "https://linkedin.com/in/john-expert",
          websiteUrl: "https://johnexpert.dev",
          socialUrls: [
            {
              id: "1",
              platform: "facebook",
              url: "https://facebook.com/johnexpert",
              label: "Facebook Profile",
            },
            {
              id: "2",
              platform: "whatsapp",
              url: "https://wa.me/15551234567",
              label: "WhatsApp Contact",
            },
            {
              id: "3",
              platform: "instagram",
              url: "https://instagram.com/johnexpert",
              label: "Instagram",
            },
          ],
          profilePicture: "",
          cv: null,
          certificates: [],
          expertiseAreas: [
            { category: "javascript", subCategory: "react" },
            { category: "javascript", subCategory: "nodejs" },
            { category: "frontend", subCategory: "typescript" },
          ],
        };

        setExpertData(sampleData);
        setFormData(sampleData);
=======
        const data = response.user;
        // Type conversion to ensure data conforms to ExpertData
        const expertDataFromApi: ExpertData = {
          ...data,
          // Include any specific expert fields that might need conversion
        };
        setExpertData(expertDataFromApi);
        setFormData(expertDataFromApi);
>>>>>>> dev
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

<<<<<<< HEAD
  // Handle input changes
  const handleInputChange = (
    field: keyof ExpertData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
=======
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
>>>>>>> dev
  };

  // Handle inline editing
  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  const handleFieldCancel = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: expertData[field as keyof ExpertData],
    }));
    setEditingField(null);
  };

  // Handle social URL management
  const handleAddSocialUrl = () => {
    const newSocialUrl: SocialUrl = {
      id: Date.now().toString(),
      platform: "other",
      url: "",
      label: "",
    };
    setFormData((prev) => ({
      ...prev,
      socialUrls: [...prev.socialUrls, newSocialUrl],
    }));
  };

  const handleUpdateSocialUrl = (
    id: string,
    field: keyof SocialUrl,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialUrls: prev.socialUrls.map((social) =>
        social.id === id ? { ...social, [field]: value } : social,
      ),
    }));
  };

  const handleRemoveSocialUrl = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      socialUrls: prev.socialUrls.filter((social) => social.id !== id),
    }));
  };

  // Handle file uploads
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

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newCertificate = {
          name: file.name,
          file: result,
          issueDate: "",
          description: "",
        };
        setFormData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, newCertificate],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle expertise area selection
  const handleExpertiseToggle = (categoryId: string, subCategoryId: string) => {
    setFormData((prev) => {
      const expertiseArea: ExpertiseArea = {
        category: categoryId,
        subCategory: subCategoryId,
      };

      const existingIndex = prev.expertiseAreas.findIndex(
        (area) =>
          area.category === expertiseArea.category &&
          area.subCategory === expertiseArea.subCategory,
      );

      return {
        ...prev,
        expertiseAreas:
          existingIndex >= 0
            ? prev.expertiseAreas.filter((_, index) => index !== existingIndex)
            : [...prev.expertiseAreas, expertiseArea],
      };
    });
  };

  // Handle image upload
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

  // Validate form data
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!formData.bio.trim()) errors.push("Bio is required");
    if (!formData.rate.trim()) errors.push("Hourly rate is required");
    if (isNaN(Number(formData.rate)) || Number(formData.rate) <= 0) {
      errors.push("Hourly rate must be a valid positive number");
    }
    if (formData.expertiseAreas.length === 0)
      errors.push("At least one expertise area is required");

    return errors;
  };

  // Handle reset all changes
  const handleReset = () => {
    setFormData(expertData);
    setEditingField(null);
  };

  const handleSaveAll = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => showToast.error(error));
      return;
    }

    setIsSaving(true);
    try {
      await profileService.updateStaffProfile(user?.id || "", {
        phone: formData.phone,
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl,
        websiteUrl: formData.websiteUrl,
        expertiseAreas: formData.expertiseAreas,
        rate: formData.rate,
        image: null,
      });
      setExpertData(formData);
      showToast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Inline edit component
  const InlineEditField = ({
    field,
    value,
    placeholder,
    type = "text",
    icon: Icon,
    required = false,
    multiline = false,
  }: {
    field: keyof ExpertData;
    value: string;
    placeholder: string;
    type?: string;
    icon?: React.ComponentType<any>;
    required?: boolean;
    multiline?: boolean;
  }) => {
    const isEditing = editingField === field;

    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {Icon && <Icon className="inline mr-2" />}
          {placeholder} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={4}
                maxLength={500}
                className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={placeholder}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
                autoFocus
              />
            )}
            <button
              onClick={() => handleFieldSave()}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFieldCancel(field)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => handleFieldEdit(field)}
            className="group cursor-pointer p-3 border border-transparent rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 relative"
          >
            <p
              className={`${value ? "text-gray-900" : "text-gray-400"} ${
                multiline ? "whitespace-pre-wrap" : ""
              }`}
            >
              {value || `Click to add ${placeholder.toLowerCase()}`}
            </p>
            <FiEdit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3 transition-opacity" />
          </div>
        )}
        {multiline && value && (
          <p className="text-xs text-gray-500 mt-1">
            {value.length}/500 characters
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isDataChanged = JSON.stringify(expertData) !== JSON.stringify(formData);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-6">
        {/* Profile Picture and Basic Information - Combined Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 mr-3 text-blue-600" />
              Profile & Basic Information
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                disabled={!isDataChanged}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDataChanged
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiRefreshCw className="mr-2 w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving || !isDataChanged}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDataChanged && !isSaving
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FiSave className="mr-2 w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
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
              </div>

              {/* Basic Information */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InlineEditField
                      field="firstName"
                      value={formData.firstName}
                      placeholder="First Name"
                      icon={FiUser}
                      required
                    />
                    <InlineEditField
                      field="lastName"
                      value={formData.lastName}
                      placeholder="Last Name"
                      icon={FiUser}
                      required
                    />
                  </div>
                  {/* Email field spans full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-600">{formData.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                  </div>
                  <InlineEditField
                    field="phone"
                    value={formData.phone}
                    placeholder="Phone Number"
                    type="tel"
                    icon={FiPhone}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information - Full Width */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-green-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiFileText className="w-5 h-5 mr-3 text-green-600" />
              Professional Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InlineEditField
                  field="bio"
                  value={formData.bio}
                  placeholder="Professional Bio"
                  required
                  multiline
                />
              </div>
              <InlineEditField
                field="rate"
                value={formData.rate}
                placeholder="Hourly Rate (USD)"
                type="number"
                icon={FiDollarSign}
                required
              />
            </div>
          </div>
        </div>

        {/* CV Upload Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiFile className="w-5 h-5 mr-3 text-orange-600" />
              CV / Resume <span className="text-red-500 ml-1">*</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors relative">
              {formData.cv ? (
                <div className="flex items-center justify-center space-x-4">
                  <FiFile className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      CV Uploaded
                    </p>
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
        </div>

        {/* Certificates Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiAward className="w-5 h-5 mr-3 text-purple-600" />
              Certificates & Achievements
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {formData.certificates.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiAward className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">{cert.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        certificates: prev.certificates.filter(
                          (_, i) => i !== index,
                        ),
                      }));
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Add Certificate (PDF, JPG, PNG)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleCertificateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Areas - Full Width */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-indigo-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiStar className="w-5 h-5 mr-3 text-indigo-600" />
              Expertise Areas <span className="text-red-500">*</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></span>
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {category.subCategories.map((subCategory) => {
                      const isSelected = formData.expertiseAreas.some(
                        (expertiseArea) =>
                          expertiseArea.category === category._id &&
                          expertiseArea.subCategory === subCategory._id,
                      );

                      return (
                        <button
                          key={subCategory._id}
                          onClick={() =>
                            handleExpertiseToggle(category._id, subCategory._id)
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{subCategory.name}</p>
                            {subCategory.description && (
                              <p className="text-xs opacity-75 mt-1">
                                {subCategory.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-800">
                <strong>Selected:</strong> {formData.expertiseAreas.length}{" "}
                areas
              </p>
              {formData.expertiseAreas.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.expertiseAreas.map((area, index) => {
                    const category = categories.find(
                      (c) => c._id === area.category,
                    );
                    const subCategory = category?.subCategories.find(
                      (sc) => sc._id === area.subCategory,
                    );
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {category?.name} → {subCategory?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Social Links Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-cyan-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiGlobe className="w-5 h-5 mr-3 text-cyan-600" />
              Social Links & Online Presence
            </h2>
            <button
              onClick={handleAddSocialUrl}
              className="flex items-center px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Link
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Primary Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InlineEditField
                  field="linkedinUrl"
                  value={formData.linkedinUrl}
                  placeholder="LinkedIn URL"
                  type="url"
                  icon={FiLinkedin}
                />
                <InlineEditField
                  field="websiteUrl"
                  value={formData.websiteUrl}
                  placeholder="Website URL"
                  type="url"
                  icon={FiGlobe}
                />
              </div>

              {/* Dynamic Social URLs */}
              {formData.socialUrls.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Social Links
                  </h3>
                  {formData.socialUrls.map((social) => {
                    const IconComponent = getPlatformIcon(social.platform);
                    const colorClass = getPlatformColor(social.platform);

                    return (
                      <div
                        key={social.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          {/* Platform Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Platform
                            </label>
                            <select
                              value={social.platform}
                              onChange={(e) =>
                                handleUpdateSocialUrl(
                                  social.id,
                                  "platform",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                              <option value="other">Other</option>
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="twitter">Twitter/X</option>
                              <option value="youtube">YouTube</option>
                              <option value="tiktok">TikTok</option>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="linkedin">LinkedIn</option>
                            </select>
                          </div>

                          {/* URL Input */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <IconComponent
                                className={`inline mr-2 ${colorClass}`}
                              />
                              URL
                            </label>
                            <input
                              type="url"
                              value={social.url}
                              onChange={(e) =>
                                handleUpdateSocialUrl(
                                  social.id,
                                  "url",
                                  e.target.value,
                                )
                              }
                              placeholder={`Enter ${social.platform} URL`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRemoveSocialUrl(social.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove link"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Label Input */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Label (Optional)
                          </label>
                          <input
                            type="text"
                            value={social.label}
                            onChange={(e) =>
                              handleUpdateSocialUrl(
                                social.id,
                                "label",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Personal Instagram, Business Page"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Add Popular Platforms */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Add Popular Platforms:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      platform: "facebook",
                      label: "Facebook",
                      icon: FiFacebook,
                      color: "bg-blue-500",
                    },
                    {
                      platform: "instagram",
                      label: "Instagram",
                      icon: FaInstagram,
                      color: "bg-pink-500",
                    },
                    {
                      platform: "twitter",
                      label: "Twitter/X",
                      icon: FaTwitter,
                      color: "bg-blue-400",
                    },
                    {
                      platform: "youtube",
                      label: "YouTube",
                      icon: FaYoutube,
                      color: "bg-red-500",
                    },
                    {
                      platform: "whatsapp",
                      label: "WhatsApp",
                      icon: FaWhatsapp,
                      color: "bg-green-500",
                    },
                  ].map(({ platform, label, icon: Icon, color }) => {
                    const alreadyExists = formData.socialUrls.some(
                      (social) => social.platform === platform,
                    );

                    return (
                      <button
                        key={platform}
                        onClick={() => {
                          if (!alreadyExists) {
                            const newSocialUrl: SocialUrl = {
                              id: Date.now().toString(),
                              platform,
                              url: "",
                              label: `${label} Profile`,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              socialUrls: [...prev.socialUrls, newSocialUrl],
                            }));
                          }
                        }}
                        disabled={alreadyExists}
                        className={`flex items-center px-3 py-2 text-white rounded-lg transition-all ${
                          alreadyExists
                            ? "bg-gray-400 cursor-not-allowed"
                            : `${color} hover:opacity-90`
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfileManager;
