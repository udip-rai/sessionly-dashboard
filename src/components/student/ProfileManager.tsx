import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiLink,
  FiX,
  FiCamera,
  FiSave,
  FiMail,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import { studentService } from "../../api/services/student.service";
import { userService } from "../../api/services/user.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { checkStudentProfileCompletion } from "../../utils/profileCompletion";
import { SimpleProfileCompletion } from "../ui/SimpleProfileCompletion";
import { useLocation } from "react-router-dom";

interface StudentData {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  image?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
}

export function StudentProfileManager() {
  const { user } = useAuth();
  const location = useLocation();

  // Debug state
  const [showDebug, setShowDebug] = useState(false);

  // Add debug info
  useEffect(() => {
    console.log("[StudentProfileManager] Component mounted");
    console.log("[StudentProfileManager] Current path:", location.pathname);
  }, [location]);

  // Loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // UI state for tabs
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Original student data from server (for reset functionality)
  const [studentData, setStudentData] = useState<StudentData>({
    username: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
    linkedinUrl: "",
    websiteUrl: "",
    otherUrls: [],
  });

  // Form data that can be modified by user
  const [formData, setFormData] = useState<StudentData>(studentData);

  // File state for profile picture
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Tab configuration
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: FiUser,
      description: "Personal details and profile picture",
    },
    {
      id: "contact",
      label: "Contact",
      icon: FiPhone,
      description: "Email and phone information",
    },
    {
      id: "social",
      label: "Social Links",
      icon: FiLink,
      description: "LinkedIn, website, and other URLs",
    },
  ];

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

    if (!formData.bio?.trim() || formData.bio.length < 50) {
      errors.push("Bio must be at least 50 characters");
    }

    return errors;
  };

  /**
   * Handles updating form data
   */
  const handleChange = (field: keyof StudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles profile image changes
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  /**
   * Handles adding a new URL to otherUrls
   */
  const addOtherUrl = () => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: [...(prev.otherUrls || []), ""],
    }));
  };

  /**
   * Handles updating a URL in otherUrls
   */
  const updateOtherUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls:
        prev.otherUrls?.map((url, i) => (i === index ? value : url)) || [],
    }));
  };

  /**
   * Handles removing a URL from otherUrls
   */
  const removeOtherUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  /**
   * Resets all form changes back to the original data
   */
  const handleReset = () => {
    setFormData(studentData);
    setNewImageFile(null);
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
      if (!user?.id) throw new Error("User ID not found");

      // Prepare update data for API call
      await studentService.updateStudentProfile(user.id, {
        username: formData.username || "",
        phone: formData.phone || "",
        bio: formData.bio || "",
        linkedinUrl: formData.linkedinUrl || "",
        websiteUrl: formData.websiteUrl || "",
        image: newImageFile,
        otherUrls: formData.otherUrls?.filter((url) => url.trim() !== "") || [],
      });

      // Update local state with saved data
      setStudentData(formData);
      setNewImageFile(null);

      // Show success message
      showToast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      showToast.error(errorMessage);
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
  const isDataChanged =
    JSON.stringify(studentData) !== JSON.stringify(formData) ||
    newImageFile !== null;

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

    switch (activeTab) {
      case "basic":
        return (
          <div className="animate-fadeIn">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="col-span-1">
                  {/* Profile Picture */}
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
                </div>

                <div className="col-span-1 lg:col-span-3">
                  {/* Basic Information Fields */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.username || ""}
                          onChange={(e) =>
                            handleChange("username", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TabNavigation />
          </div>
        );

      case "contact":
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-6">
                {/* Email Field - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="email"
                      value={formData.email || ""}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Email not available"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                {/* Phone Number */}
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
            <TabNavigation />
          </div>
        );

      case "social":
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Social Links
              </h3>
              <div className="space-y-4">
                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <div className="flex items-center">
                    <FiLink className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="url"
                      value={formData.linkedinUrl || ""}
                      onChange={(e) =>
                        handleChange("linkedinUrl", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="flex items-center">
                    <FiLink className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="url"
                      value={formData.websiteUrl || ""}
                      onChange={(e) =>
                        handleChange("websiteUrl", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {/* Other Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Links
                  </label>
                  <div className="space-y-3">
                    {(formData.otherUrls || []).map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FiLink className="h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            updateOtherUrl(index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="https://other-link.com"
                        />
                        <button
                          onClick={() => removeOtherUrl(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addOtherUrl}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <FiPlus className="h-4 w-4 mr-1" /> Add another link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <TabNavigation />
          </div>
        );

      default:
        return null;
    }
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
                Student Profile Management
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                Manage your personal profile and contact information
              </p>
            </div>

            {/* Simplified profile completion indicator */}
            <SimpleProfileCompletion
              status={checkStudentProfileCompletion(formData)}
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

      {/* Debug panel - only visible in development with trigger */}
      {process.env.NODE_ENV !== "production" && (
        <div
          onClick={() => setShowDebug(!showDebug)}
          className="cursor-pointer"
        >
          {showDebug && (
            <div className="p-4 bg-gray-800 text-white rounded-lg mb-4 text-xs font-mono">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-yellow-300">
                  Profile Manager Debug Info
                </h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDebug(false);
                  }}
                >
                  ×
                </button>
              </div>
              <div>
                Current route:{" "}
                <span className="text-green-300">{location.pathname}</span>
              </div>
              <div>
                User role:{" "}
                <span className="text-blue-300">
                  {user?.userType || "unknown"}
                </span>
              </div>
              <div>
                Component:{" "}
                <span className="text-purple-300">StudentProfileManager</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentProfileManager;
