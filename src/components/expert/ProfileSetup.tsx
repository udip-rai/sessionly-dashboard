import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiDollarSign,
  FiCheck,
  FiSkipForward,
} from "react-icons/fi";
import { profileService } from "../../api/services/profile.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import { CategoriesResponse } from "../../types/expertise";
import { ProfileSetupProps, StepProps } from "./profile/_types";

// Simple form data interface for profile setup
interface ExpertFormData {
  username?: string;
  phone: string;
  bio: string;
  image: File | string | null;
  rate: string;
  linkedinUrl: string;
  websiteUrl: string;
  expertiseAreas: any[];
}

const ProgressSteps = ({ currentStep, totalSteps }: StepProps) => (
  <div className="w-full max-w-xl mx-auto mb-8">
    <div className="relative">
      {" "}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-navy via-indigo-500 to-blue-400 transition-all duration-500 ease-out transform origin-left"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>{" "}
      <div className="relative flex justify-between">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform
              ${
                index < currentStep
                  ? "bg-gradient-to-r from-navy to-indigo-500 text-white scale-105 shadow-lg"
                  : index === currentStep
                  ? "bg-white text-navy scale-110 shadow-lg ring-4 ring-navy/20"
                  : "bg-white text-gray-400 hover:scale-105 hover:text-navy hover:bg-gray-50"
              }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface APICategory {
  _id: string;
  name: string;
  description: string;
  subCategories: {
    _id: string;
    name: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProfileSetup({
  onComplete,
}: // profileStatus,
ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExpertFormData>({
    username: "",
    phone: "",
    bio: "",
    image: null,
    rate: "",
    linkedinUrl: "",
    websiteUrl: "",
    expertiseAreas: [],
  });
  const [_, setError] = useState("");
  const { data: categoriesResponse } = useQuery<CategoriesResponse>({
    queryKey: ["expertiseAreas"],
    queryFn: profileService.getExpertiseAreas,
  });

  const categories = categoriesResponse?.data;

  const updateProfileMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error("User ID not found");
      return profileService.updateStaffProfile(user.id, {
        username: formData.username || "",
        phone: formData.phone,
        bio: formData.bio,
        image: formData.image,
        rate: formData.rate ? `$${formData.rate}/hour` : "",
        linkedinUrl: formData.linkedinUrl,
        websiteUrl: formData.websiteUrl,
        expertiseAreas: formData.expertiseAreas,
        otherUrls: [], // Default empty array for ProfileSetup
        advisoryTopics: [], // Default empty array for ProfileSetup
        cv: null as any, // Default null for ProfileSetup
        certificates: [] as any, // Default empty array for ProfileSetup
      });
    },
    onSuccess: () => {
      showToast.success("Profile updated successfully!");
      onComplete();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      showToast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const handleSkip = () => {
    showToast.info(
      "Profile setup skipped. You can complete it later from your profile settings.",
    );
    navigate("/expert-dashboard");
  };

  const handleExpertiseChange = (categoryId: string, subCategoryId: string) => {
    setFormData((prev) => {
      const exists = prev.expertiseAreas.some(
        (area) =>
          area.category === categoryId && area.subCategory === subCategoryId,
      );

      if (exists) {
        return {
          ...prev,
          expertiseAreas: prev.expertiseAreas.filter(
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
          ...prev.expertiseAreas,
          { category: categoryId, subCategory: subCategoryId },
        ],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.phone.trim() !== "" && formData.bio.trim() !== "";
      case 2:
        return true; // Image is optional
      case 3:
        return formData.expertiseAreas.length > 0;
      case 4:
        return formData.rate.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      showToast.error("Please fill in all required fields");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      updateProfileMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderExpertiseStep = () => (
    <div className="space-y-8">
      {categories?.map((category: APICategory) => (
        <div
          key={category._id}
          className="bg-white/80 backdrop-blur-xl rounded-lg border border-white/40 p-4 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {" "}
          <h4 className="text-base font-semibold text-navy mb-2 flex items-center justify-between">
            {category.name}
            <span className="text-sm text-gray-600 font-normal">
              {category.description}
            </span>
          </h4>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.subCategories.map((subCategory) => {
              const isSelected = formData.expertiseAreas.some(
                (area) =>
                  area.category === category._id &&
                  area.subCategory === subCategory._id,
              );

              return (
                <button
                  key={subCategory._id}
                  type="button"
                  onClick={() =>
                    handleExpertiseChange(category._id, subCategory._id)
                  }
                  className={`
                      flex items-center justify-between p-4 rounded-xl text-left
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-navy to-blue-500 text-white border-transparent shadow-lg transform scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:shadow-md"
                      }
                      border transition-all duration-300 ease-in-out hover:scale-105
                    `}
                >
                  <div>
                    <div className="font-medium text-sm">
                      {subCategory.name}
                    </div>
                    <div className="text-xs mt-1 ${isSelected ? 'text-gray-200' : 'text-gray-500'}">
                      {subCategory.description}
                    </div>
                  </div>
                  {isSelected && (
                    <FiCheck className="h-5 w-5 flex-shrink-0 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {formData.expertiseAreas.length === 0 && (
        <div className="text-sm text-amber-200 bg-amber-500/10 backdrop-blur-sm border border-amber-200/20 p-4 rounded-lg">
          Please select at least one area of expertise to continue.
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fadeIn">
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Set up your contact information and professional bio
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {/* Phone field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>{" "}
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                      transition-all duration-300 ease-in-out bg-white/80
                      focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                      hover:border-navy/30 hover:shadow-md hover:bg-white/90
                      placeholder:text-gray-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Bio field */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Professional Bio
                  </label>{" "}
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                    placeholder="Tell us about your professional experience and expertise..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-green-600" />
                Profile Picture
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload a professional photo for your profile
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                      {formData.image ? (
                        <img
                          src={
                            typeof formData.image === "string"
                              ? formData.image
                              : URL.createObjectURL(formData.image)
                          }
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <FiUser className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-2 border border-blue-200 rounded-lg shadow-sm text-sm font-medium text-blue-600 hover:shadow-md transition-all duration-300">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a professional photo of yourself
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-indigo-600" />
                Areas of Expertise
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose the areas you specialize in. You can select multiple
                categories and subcategories.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              {renderExpertiseStep()}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn">
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Set Your Rate
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Define your hourly rate for mentoring sessions
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="rate"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Hourly Rate (USD)
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="rate"
                      id="rate"
                      required
                      min="0"
                      step="0.01"
                      value={formData.rate}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                      transition-all duration-300 ease-in-out bg-white/80
                      focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                      hover:border-navy/30 hover:shadow-md hover:bg-white/90
                      placeholder:text-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Set a competitive rate based on your expertise and
                    experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div
        className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-[2px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
        }}
      ></div>
      <div className="max-w-3xl mx-auto relative">
        {/* Skip button at the top */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-3 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 
            transition-all duration-300 ease-in-out hover:scale-105 rounded-xl border border-gray-300 
            hover:border-gray-400 hover:shadow-lg backdrop-blur-sm flex items-center gap-2 font-medium"
          >
            <FiSkipForward className="w-5 h-5" />
            Skip for now
          </button>
        </div>

        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-navy via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Let's set up your profile so you can start mentoring
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 You can skip this setup and complete your profile later from
              your dashboard
            </p>
          </div>
        </div>

        <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg px-8 py-8 transform transition-all duration-500 hover:shadow-xl border border-white/40 hover:bg-white/90">
          <form className="space-y-8">
            {" "}
            <div
              key={currentStep}
              className="transition-all duration-500 transform animate-fadeIn"
              style={{
                animation: "fadeSlideIn 0.5s ease-out",
              }}
            >
              {renderStep()}
            </div>
            <style>{`
              @keyframes fadeSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-6 py-2.5 text-sm font-medium text-navy hover:text-navy/80 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:scale-105 
                  disabled:hover:scale-100 rounded-lg border border-gray-200/60 hover:border-navy/30 
                  hover:shadow-md disabled:hover:shadow-none bg-white/80 hover:bg-white/90"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 
                  transition-all duration-300 ease-in-out hover:scale-105 rounded-lg border border-gray-200/60 
                  hover:border-gray-300 hover:shadow-md bg-white/80 hover:bg-white/90 flex items-center space-x-2"
                >
                  <FiSkipForward className="w-4 h-4" />
                  <span>Skip for now</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-2.5 bg-gradient-to-r from-navy via-indigo-600 to-blue-500 text-white text-sm font-medium 
                rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:from-navy hover:to-indigo-500
                active:scale-95 transform shadow-md"
              >
                {currentStep === totalSteps ? "Complete Setup" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
