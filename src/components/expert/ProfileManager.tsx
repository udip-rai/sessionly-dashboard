import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { categoryService } from "../../api/services/category.service";
import { profileService } from "../../api/services/profile.service";
import { showToast } from "../../utils/toast";
import { checkExpertProfileCompletion } from "../../utils/profileCompletion";
import {
  FiUser,
  FiSave,
  FiRefreshCw,
  FiBriefcase,
  FiFileText,
  FiTarget,
  FiLink,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { SimpleProfileCompletion } from "../ui/SimpleProfileCompletion";
import { Category } from "../../types/expertise";
import {
  ExpertData,
  ProfilePicture,
  BasicInformation,
  ProfessionalInfo,
  CVUpload,
  CertificatesSection,
  ExpertiseAreas,
  SocialLinks,
} from "./profile";

export const ExpertProfileManager: React.FC = () => {
  const { user } = useAuth();

  // Loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // UI state for tabs
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);

  // Original expert data from server (for reset functionality)
  const [expertData, setExpertData] = useState<ExpertData>({
    username: "",
    email: "",
    phone: "",
    bio: "",
    rate: "",
    profilePicture: "",
    linkedinUrl: "",
    websiteUrl: "",
    otherUrls: [],
    advisoryTopics: [],
    expertiseAreas: [],
    cv: null,
    certificates: [],
  });

  // Form data that can be modified by user
  const [formData, setFormData] = useState<ExpertData>(expertData);

  // Currently editing field (for inline editing)
  const [editingField, setEditingField] = useState<string | null>(null);

  // Tab configuration
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: FiUser,
      description: "Personal details and profile picture",
    },
    {
      id: "professional",
      label: "Professional",
      icon: FiBriefcase,
      description: "Bio, rate, and work information",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FiFileText,
      description: "CV and certificates",
    },
    {
      id: "expertise",
      label: "Expertise",
      icon: FiTarget,
      description: "Areas of expertise and skills",
    },
    {
      id: "social",
      label: "Social Links",
      icon: FiLink,
      description: "LinkedIn, website, and other URLs",
    },
  ];

  /**
   * Fetches categories and expert profile data on component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      // Skip if no user is authenticated
      if (!user) return;

      try {
        // Fetch categories for expertise areas
        const categoriesResponse = await categoryService.getAllCategories();
        const categoriesWithTimestamps = categoriesResponse.data.map((cat) => ({
          ...cat,
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: cat.updatedAt || new Date().toISOString(),
        }));
        setCategories(categoriesWithTimestamps);

        // Fetch current user's expert profile
        const profileResponse = await profileService.getStaffProfile();
        const expertProfile = profileResponse.data;

        // Update both original data and form data
        setExpertData(expertProfile);
        setFormData(expertProfile);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /**
   * Validates the form data and returns an array of error messages
   * @returns Array of validation error messages
   */
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Required field validations
    if (!formData.username.trim()) {
      errors.push("Username is required");
    }

    if (!formData.phone.trim()) {
      errors.push("Phone number is required");
    }

    if (!formData.bio.trim()) {
      errors.push("Bio is required");
    }

    if (!formData.rate.trim()) {
      errors.push("Hourly rate is required");
    }

    if (formData.expertiseAreas.length === 0) {
      errors.push("At least one expertise area is required");
    }

    return errors;
  };

  /**
   * Resets all form changes back to the original data
   */
  const handleReset = () => {
    setFormData(expertData);
  };

  /**
   * Saves all profile changes to the server
   */
  const handleSaveAll = async () => {
    // Validate form before saving
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showToast.error(error));
      return;
    }

    setIsSaving(true);

    try {
      // Prepare update data for API call
      const updateData = {
        phone: formData.phone,
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl,
        websiteUrl: formData.websiteUrl,
        expertiseAreas: formData.expertiseAreas,
        rate: formData.rate,
        image: null, // TODO: Handle profile image updates
      };

      // Update profile via API
      await profileService.updateStaffProfile(user?.id || "", updateData);

      // Update local state with saved data
      setExpertData(formData);

      // Show success message
      showToast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user has made any changes to the form
  const isDataChanged = JSON.stringify(expertData) !== JSON.stringify(formData);

  // Render tab content based on active tab
  const renderTabContent = () => {
    const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const isFirstTab = currentTabIndex === 0;
    const isLastTab = currentTabIndex === tabs.length - 1;

    const TabNavButton = ({
      direction,
      onClick,
      disabled,
    }: {
      direction: "prev" | "next";
      onClick: () => void;
      disabled: boolean;
    }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md hover:scale-105"
        }`}
      >
        {direction === "prev" ? (
          <>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </>
        ) : (
          <>
            Next
            <FiArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    );

    const TabNavigation = () => (
      <div className="flex justify-between mt-8 border-t border-gray-100 pt-4">
        <TabNavButton
          direction="prev"
          onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
          disabled={isFirstTab}
        />
        <TabNavButton
          direction="next"
          onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
          disabled={isLastTab}
        />
      </div>
    );

    const content = (() => {
      switch (activeTab) {
        case "basic":
          return (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="col-span-1 lg:col-span-1">
                  <ProfilePicture
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
                <div className="col-span-1 lg:col-span-3">
                  <BasicInformation
                    formData={formData}
                    setFormData={setFormData}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    originalData={expertData}
                  />
                </div>
              </div>
              <TabNavigation />
            </div>
          );

        case "professional":
          return (
            <div className="animate-fadeIn">
              <div className="space-y-6">
                <ProfessionalInfo
                  formData={formData}
                  setFormData={setFormData}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  originalData={expertData}
                />
              </div>
              <TabNavigation />
            </div>
          );

        case "documents":
          return (
            <div className="animate-fadeIn">
              <div className="space-y-6">
                <CVUpload formData={formData} setFormData={setFormData} />
                <CertificatesSection
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
              <TabNavigation />
            </div>
          );

        case "expertise":
          return (
            <div className="animate-fadeIn">
              <div className="space-y-6">
                <ExpertiseAreas
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                />
              </div>
              <TabNavigation />
            </div>
          );

        case "social":
          return (
            <div className="animate-fadeIn">
              <div className="space-y-6">
                <SocialLinks
                  formData={formData}
                  setFormData={setFormData}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  originalData={expertData}
                />
              </div>
              <TabNavigation />
            </div>
          );

        default:
          return null;
      }
    })();

    return <div className="relative">{content}</div>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-0">
      {/* ===== HEADER WITH SAVE/RESET ACTIONS ===== */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <FiUser className="w-6 h-6 mr-3 text-blue-600" />
                Expert Profile Management
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                Manage your professional profile and expertise areas
              </p>
            </div>

            {/* Simplified profile completion indicator */}
            <SimpleProfileCompletion
              status={checkExpertProfileCompletion(formData)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-t border-gray-100 pt-4">
            {/* Reset button */}
            <button
              onClick={handleReset}
              disabled={!isDataChanged}
              className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDataChanged
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiRefreshCw className="mr-2 w-4 h-4" />
              Reset Changes
            </button>

            {/* Save button */}
            <button
              onClick={handleSaveAll}
              disabled={isSaving || !isDataChanged}
              className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
      </div>

      {/* ===== TABBED NAVIGATION ===== */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab headers - Added overflow handling for mobile */}
        <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <nav className="flex space-x-0 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative overflow-hidden bg-white p-4 text-center hover:bg-gray-50 focus:z-10 transition-colors duration-200 min-w-[150px] ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium line-clamp-1">
                      {tab.label}
                    </span>
                    <span className="hidden sm:block text-xs text-gray-400">
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content - Added responsive padding */}
        <div className="p-4 sm:p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ExpertProfileManager;
