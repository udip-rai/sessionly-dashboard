import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiLink,
  FiCamera,
  FiSave,
  FiMail,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiUpload,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import { studentService } from "../../api/services/student.service";
import { userService } from "../../api/services/user.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { checkStudentProfileCompletion } from "../../utils/profileCompletion";
import { SimpleProfileCompletion } from "../ui/SimpleProfileCompletion";
import { useLocation } from "react-router-dom";
import { InlineEditField } from "./profile/InlineEditField";
import { SocialLinks } from "./profile/SocialLinks";
import { StudentData } from "./profile/_types";

export function StudentProfileManager() {
  // Editing state
  const [editingField, setEditingField] = useState<string | null>(null);
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
  const [studentData, setStudentData] = useState<StudentData | any>({
    username: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
    linkedinUrl: "",
    websiteUrl: "",
    otherUrls: [],
    resume: null, // Added resume field
    userType: "student",
  });

  // Form data that can be modified by user
  const [formData, setFormData] = useState<StudentData>(studentData);

  // File state for profile picture
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Resume/Documents state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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
    {
      id: "documents",
      label: "Documents",
      icon: FiFileText,
      description: "Resume and other documents",
    },
  ];

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.userType || user.userType !== "student") return;

      setIsLoading(true);
      try {
        const response = await userService.getCurrentUser(user.userType);
        const userData = response.user;
        console.log("[StudentProfileManager] Fetched data:", userData);

        // Normalize data - ensure all fields have valid defaults
        const normalizedData: StudentData = {
          _id: userData.id || "",
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          image: userData.image || "",
          linkedinUrl: userData.linkedinUrl || "",
          websiteUrl: userData.websiteUrl || "",
          otherUrls: Array.isArray(userData.otherUrls)
            ? userData.otherUrls
            : [],
          resume: (userData as any).resume || null, // Added resume field with type assertion
          userType: "student",
          emailVerified: userData.emailVerified || false,
        };

        setStudentData(normalizedData);
        setFormData(normalizedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
        showToast.error(
          "Failed to load profile data. Please try refreshing the page.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  /**
   * Validates the form data - No validations required for student profile
   */
  const validateForm = (): string[] => {
    return [];
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

      // Prepare update data for API call - matching backend schema
      const updateData: any = {
        username: formData.username || "",
        phone: formData.phone || "",
        bio: formData.bio || "",
        linkedinUrl: formData.linkedinUrl || "",
        websiteUrl: formData.websiteUrl || "",
        image: newImageFile,
        otherUrls: formData.otherUrls?.filter((url) => url.trim() !== "") || [],
      };

      await studentService.updateStudentProfile(user.id, updateData);

      // Update local state with saved data
      setStudentData(formData);
      setNewImageFile(null);

      // Show success message
      showToast.success("Profile updated successfully!");

      // If we're on the last tab and just saved, optionally redirect or show additional feedback
      if (tabs.findIndex((tab) => tab.id === activeTab) === tabs.length - 1) {
        console.log("[StudentProfileManager] Completed final step save");
        // Optional: Set a "complete" state or redirect after short delay
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      // Enhanced error message extraction logic
      let errorMessage = "Failed to update profile";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showToast.error(errorMessage);

      // Log details for debugging
      console.log("[StudentProfileManager] Profile update error details:", {
        statusCode: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
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
  } // Check if user has made any changes to the form
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
          onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
          disabled={isFirstTab}
        />

        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">
            {currentTabIndex + 1} of {tabs.length}
          </span>
          <div className="flex space-x-1">
            {tabs.map((_, index) => (
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

        {isLastTab || activeTab === "social" ? (
          <button
            onClick={handleSaveAll}
            disabled={isSaving || !isDataChanged}
            className={`group flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              isDataChanged && !isSaving
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2 w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                Save Profile
              </>
            )}
          </button>
        ) : (
          <TabNavButton
            direction="next"
            onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
            disabled={false}
          />
        )}
      </div>
    );

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
                      <div className="space-y-4">
                        <InlineEditField
                          field="username"
                          value={formData.username || ""}
                          placeholder="Username"
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onUpdate={handleChange}
                          onCancel={(field) =>
                            handleChange(field, studentData[field] || "")
                          }
                        />
                        <InlineEditField
                          field="bio"
                          value={formData.bio || ""}
                          placeholder="Bio"
                          multiline
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onUpdate={handleChange}
                          onCancel={(field) =>
                            handleChange(field, studentData[field] || "")
                          }
                        />

                        {/* <div className="flex justify-between items-center mt-1">
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
                        </div> */}
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
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiPhone className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your email and phone information
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
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
                  <InlineEditField
                    field="phone"
                    value={formData.phone || ""}
                    placeholder="Phone Number"
                    type="tel"
                    icon={FiPhone}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onUpdate={handleChange}
                    onCancel={(field) =>
                      handleChange(field, studentData[field] || "")
                    }
                  />
                </div>
              </div>
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

            <div className="bg-white rounded-lg shadow p-6">
              <SocialLinks
                formData={formData}
                setFormData={setFormData}
                editingField={editingField}
                setEditingField={setEditingField}
                originalData={studentData}
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
                Documents & Resume
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload and manage your resume and other important documents
              </p>
            </div>

            <div className="space-y-6">
              {/* Resume Upload Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Resume</h4>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600 mb-4">
                    PDF files only, maximum 5MB
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFile(file);
                      }
                    }}
                    className="hidden"
                    id="resume-upload"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={() =>
                        document.getElementById("resume-upload")?.click()
                      }
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Choose File
                    </button>

                    {resumeFile && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiFileText className="w-4 h-4 mr-2 text-purple-600" />
                        {resumeFile.name}
                        <button
                          onClick={() => setResumeFile(null)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Resume Display */}
                {formData.resume && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiFileText className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          Current Resume
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // Download resume logic would go here
                            if (formData.resume) {
                              window.open(formData.resume, "_blank");
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          title="Download Resume"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete your resume?",
                              )
                            ) {
                              setFormData({ ...formData, resume: null });
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete Resume"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Documents Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Additional Documents
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Upload any additional documents like cover letters,
                  portfolios, or certificates.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FiFileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Additional document uploads coming soon
                  </p>
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
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100">
        <div className="bg-white/70 backdrop-blur-md border-b border-blue-100/50">
          <div className="flex flex-col gap-4 sm:gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <FiUser className="w-7 h-7 mr-3 text-blue-600" />
                  Student Profile Management
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Manage your personal profile and contact information with
                  modern tools
                </p>
              </div>

              {/* Enhanced profile completion indicator */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-blue-100">
                <SimpleProfileCompletion
                  status={(() => {
                    const status = checkStudentProfileCompletion(formData);
                    console.log("[Profile Completion Debug]");
                    console.log("Form Data:", formData);
                    console.log("Completion Status:", status);
                    console.log("Completed Fields:", status.completedFields);
                    console.log("Missing Fields:", status.missingFields);
                    console.log("Critical Missing:", status.criticalMissing);
                    console.log("Optional Missing:", status.optionalMissing);
                    console.log("Percentage:", status.completionPercentage);
                    return status;
                  })()}
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
            className="flex space-x-0 overflow-x-auto scroll-smooth"
            aria-label="Tabs"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex-shrink-0 overflow-hidden bg-white p-4 text-center hover:bg-gray-50/80 focus:z-10 transition-all duration-300 w-[150px] backdrop-blur-sm ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 bg-gradient-to-b from-blue-50/50 to-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
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
        <div className="p-4 sm:p-6">
          {isSaving ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Saving your profile...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please wait while we update your information
              </p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
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
