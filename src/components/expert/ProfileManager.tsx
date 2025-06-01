import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { categoryService } from "../../api/services/category.service";
import { profileService } from "../../api/services/profile.service";
import { showToast } from "../../utils/toast";
import { checkExpertProfileCompletion } from "../../utils/profileCompletion";
import {
  FiUser,
  FiSave,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiFileText,
  FiTarget,
  FiLink,
} from "react-icons/fi";
import { SimpleProfileCompletion } from "../ui/SimpleProfileCompletion";
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
import { EXPERT_TABS, INITIAL_EXPERT_DATA } from "./profile/_constants";

export const ExpertProfileManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // UI state for tabs
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Currently editing field (for inline editing)
  const [editingField, setEditingField] = useState<string | null>(null);

  // React Query for categories data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      if (user?.userType === "admin") {
        return categoryService.getAllCategories();
      } else {
        return categoryService.getCategoriesForExperts();
      }
    },
    enabled: !!user,
    select: (response) => {
      // Add timestamps if missing
      return response.data.map((cat) => ({
        ...cat,
        createdAt: cat.createdAt || new Date().toISOString(),
        updatedAt: cat.updatedAt || new Date().toISOString(),
      }));
    },
  });

  // React Query for staff profile data
  const { data: expertData = INITIAL_EXPERT_DATA, isLoading: profileLoading } =
    useQuery({
      queryKey: ["staffProfile"],
      queryFn: () => profileService.getStaffProfile(),
      enabled: !!user,
      select: (response) => response.data,
    });

  // Form data that can be modified by user
  const [formData, setFormData] = useState<ExpertData>(expertData);

  // Update form data when expert data changes (after loading)
  React.useEffect(() => {
    if (expertData && expertData !== INITIAL_EXPERT_DATA) {
      setFormData(expertData);
    }
  }, [expertData]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (updateData: any) => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.updateStaffProfile(user.id, updateData);
    },
    onSuccess: () => {
      showToast.success("Profile updated successfully!");
      // Invalidate and refetch the profile data
      queryClient.invalidateQueries({ queryKey: ["staffProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      showToast.error(errorMessage);
    },
  });

  const isLoading = categoriesLoading || profileLoading;
  const isSaving = updateProfileMutation.isPending;

  /**
   * Validates the form data and returns an array of error messages
   */
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Required field validations
    if (!formData.username?.trim()) {
      errors.push("Username is required");
    }

    if (!formData.phone?.trim()) {
      errors.push("Phone number is required");
    }

    if (!formData.bio?.trim()) {
      errors.push("Bio is required");
    }

    if (!formData.rate?.trim()) {
      errors.push("Hourly rate is required");
    }

    if (formData.expertiseAreas?.length === 0) {
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

    // Debug logging for file uploads
    console.log("[ProfileManager] handleSaveAll - Processing form data:", {
      hasImage: !!formData.image,
      imageType: typeof formData.image,
      hasCv: !!formData.cv,
      cvType: typeof formData.cv,
      certificates: formData.certificates?.length || 0,
    });

    console.log("formData", formData);

    // Prepare update data with all required fields (excluding certificates - handled separately)
    const updateData = {
      username: formData.username || "",
      phone: formData.phone || "",
      bio: formData.bio || "",
      linkedinUrl: formData.linkedinUrl || "",
      websiteUrl: formData.websiteUrl || "",
      otherUrls: formData.otherUrls || [],
      expertiseAreas: formData.expertiseAreas || [],
      advisoryTopics: formData.advisoryTopics || [],
      rate: formData.rate || "",
      image: formData.image || null,
      cv: formData.cv || null,
      // certificates: formData.certificates || [], // Certificates managed separately via dedicated APIs
    };

    console.log(
      "[ProfileManager] handleSaveAll - Update data prepared:",
      updateData,
    );

    // Execute the mutation
    updateProfileMutation.mutate(updateData);
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
    const currentTabIndex = EXPERT_TABS.findIndex(
      (tab) => tab.id === activeTab,
    );
    const isFirstTab = currentTabIndex === 0;
    const isLastTab = currentTabIndex === EXPERT_TABS.length - 1;

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
        className={`group flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg hover:scale-105 border border-blue-200"
        }`}
      >
        {direction === "prev" ? (
          <>
            <FiArrowLeft
              className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                !disabled ? "group-hover:-translate-x-1" : ""
              }`}
            />
            Previous
          </>
        ) : (
          <>
            Next
            <FiArrowRight
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                !disabled ? "group-hover:translate-x-1" : ""
              }`}
            />
          </>
        )}
      </button>
    );

    const TabNavigation = () => (
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-white rounded-lg p-4">
        <TabNavButton
          direction="prev"
          onClick={() => setActiveTab(EXPERT_TABS[currentTabIndex - 1].id)}
          disabled={isFirstTab}
        />

        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">
            {currentTabIndex + 1} of {EXPERT_TABS.length}
          </span>
          <div className="flex space-x-1">
            {EXPERT_TABS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTabIndex
                    ? "bg-blue-600 w-8"
                    : index < currentTabIndex
                    ? "bg-green-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <TabNavButton
          direction="next"
          onClick={() => setActiveTab(EXPERT_TABS[currentTabIndex + 1].id)}
          disabled={isLastTab}
        />
      </div>
    );

    const content = (() => {
      switch (activeTab) {
        case "basic":
          return (
            <div className="animate-fadeIn">
              {/* Section Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Update your personal details and profile picture
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              {/* Section Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiBriefcase className="w-5 h-5 mr-2 text-green-600" />
                  Professional Information
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your bio, hourly rate, and professional details
                </p>
              </div>

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
              {/* Section Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2 text-purple-600" />
                  Documents & Certificates
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upload your CV and professional certificates
                </p>
              </div>

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
              {/* Section Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiTarget className="w-5 h-5 mr-2 text-orange-600" />
                  Areas of Expertise
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select your expertise areas and skills to help students find
                  you
                </p>
              </div>

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
              {/* Section Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiLink className="w-5 h-5 mr-2 text-indigo-600" />
                  Social Links & Online Presence
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add your LinkedIn, website, and other professional links
                </p>
              </div>

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
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100">
        <div className="bg-white/70 backdrop-blur-md border-b border-blue-100/50">
          <div className="flex flex-col gap-4 sm:gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <FiUser className="w-7 h-7 mr-3 text-blue-600" />
                  Expert Profile Management
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Manage your professional profile and expertise areas with
                  modern tools
                </p>
              </div>

              {/* Enhanced profile completion indicator */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-blue-100">
                <SimpleProfileCompletion
                  status={checkExpertProfileCompletion(formData)}
                />
              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-blue-100/50 pt-4">
              {/* Reset button with enhanced styling */}
              <button
                onClick={handleReset}
                disabled={!isDataChanged}
                className={`group flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDataChanged
                    ? "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-md hover:shadow-lg transform hover:scale-105"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiRefreshCw
                  className={`mr-2 w-4 h-4 transition-transform duration-300 ${
                    isDataChanged ? "group-hover:rotate-180" : ""
                  }`}
                />
                Reset Changes
              </button>

              {/* Save button with enhanced styling */}
              <button
                onClick={handleSaveAll}
                disabled={isSaving || !isDataChanged}
                className={`group flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDataChanged && !isSaving
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FiSave
                  className={`mr-2 w-4 h-4 transition-transform duration-300 ${
                    isSaving ? "animate-pulse" : "group-hover:scale-110"
                  }`}
                />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABBED NAVIGATION ===== */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab headers - Enhanced scrollable navigation */}
        <div className="border-b border-gray-200">
          <nav
            className="flex space-x-0 overflow-x-auto px-4 scroll-smooth"
            aria-label="Tabs"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {EXPERT_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex-shrink-0 overflow-hidden bg-white p-4 text-center hover:bg-gray-50 focus:z-10 transition-colors duration-200 w-[150px] ${
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
