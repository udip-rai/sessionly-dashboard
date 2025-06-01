import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiLink,
  FiGithub,
  FiSkipForward,
} from "react-icons/fi";
import { studentService } from "../../api/services/student.service";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

interface ProfileSetupProps {
  onComplete: () => void;
  profileStatus: {
    isComplete: boolean;
    missingFields: string[];
  };
}

interface FormData {
  username: string;
  phone: string;
  bio: string;
  image: File | null;
  linkedinUrl: string;
  websiteUrl: string;
  otherUrls: string[];
}

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps = ({ currentStep, totalSteps }: StepProps) => (
  <div className="w-full max-w-xl mx-auto mb-8">
    <div className="relative">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-navy via-indigo-500 to-blue-400 transition-all duration-500 ease-out transform origin-left"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
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

export default function StudentProfileSetup({
  onComplete,
  profileStatus,
}: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    phone: "",
    bio: "",
    image: null,
    linkedinUrl: "",
    websiteUrl: "",
    otherUrls: [""],
  });

  // Update initial form state if profile is partially complete
  useEffect(() => {
    if (profileStatus && profileStatus.missingFields.length > 0) {
      setCurrentStep(getMissingFieldStep(profileStatus.missingFields[0]));
    }
  }, [profileStatus]);

  const getMissingFieldStep = (field: string): number => {
    const fieldToStep: Record<string, number> = {
      username: 1,
      bio: 1,
      phone: 2,
      linkedinUrl: 3,
      websiteUrl: 3,
      otherUrls: 3,
    };
    return fieldToStep[field] || 1;
  };

  const updateProfileMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error("User ID not found");
      return studentService.updateStudentProfile(user.id, {
        ...formData,
        otherUrls: formData.otherUrls.filter((url) => url.trim() !== ""),
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
    },
  });

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

  const handleOtherUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newUrls = [...prev.otherUrls];
      newUrls[index] = value;
      return {
        ...prev,
        otherUrls: newUrls,
      };
    });
  };

  const addOtherUrl = () => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: [...prev.otherUrls, ""],
    }));
  };

  const removeOtherUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      otherUrls: prev.otherUrls.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        const basicInfoMissing = ["username", "bio"].some((field) =>
          profileStatus?.missingFields.includes(field),
        );
        if (basicInfoMissing) {
          return formData.username.trim() !== "" && formData.bio.trim() !== "";
        }
        return true;
      case 2:
        const contactInfoMissing = ["phone"].some((field) =>
          profileStatus?.missingFields.includes(field),
        );
        if (contactInfoMissing) {
          return formData.phone.trim() !== "";
        }
        return true;
      case 3:
        const socialInfoMissing = [
          "linkedinUrl",
          "websiteUrl",
          "otherUrls",
        ].some((field) => profileStatus?.missingFields.includes(field));
        if (socialInfoMissing) {
          return (
            formData.linkedinUrl.trim() !== "" ||
            formData.websiteUrl.trim() !== "" ||
            formData.otherUrls.some((url) => url.trim() !== "")
          );
        }
        return true;
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

  const handleSkip = () => {
    // Navigate directly to the student dashboard
    navigate("/student-dashboard");
    showToast.info(
      "Profile setup skipped. You can complete it later from your dashboard.",
    );
  };

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
                Set up your username and tell us about yourself
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Bio
                  </label>
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
                    placeholder="Tell us about yourself and your interests..."
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
                <FiPhone className="w-5 h-5 mr-2 text-green-600" />
                Profile Picture & Contact
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload your photo and add contact information
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
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
                        Upload a clear photo of yourself
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
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
                    </div>
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
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            {/* Section Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiLink className="w-5 h-5 mr-2 text-indigo-600" />
                Social & Professional Links
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add your LinkedIn, website, and other professional links
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {/* LinkedIn URL */}
                <div>
                  <label
                    htmlFor="linkedinUrl"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    LinkedIn Profile
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                      transition-all duration-300 ease-in-out bg-white/80
                      focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                      hover:border-navy/30 hover:shadow-md hover:bg-white/90
                      placeholder:text-gray-400"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div>
                  <label
                    htmlFor="websiteUrl"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Personal Website
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="pl-10 block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                      transition-all duration-300 ease-in-out bg-white/80
                      focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                      hover:border-navy/30 hover:shadow-md hover:bg-white/90
                      placeholder:text-gray-400"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {/* Other Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">
                    Other Links (GitHub, Portfolio, etc.)
                  </label>
                  <div className="space-y-3">
                    {formData.otherUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1 rounded-lg">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiGithub className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) =>
                              handleOtherUrlChange(index, e.target.value)
                            }
                            className="pl-10 block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                            transition-all duration-300 ease-in-out bg-white/80
                            focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                            hover:border-navy/30 hover:shadow-md hover:bg-white/90
                            placeholder:text-gray-400"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeOtherUrl(index)}
                            className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOtherUrl}
                      className="text-sm text-navy hover:text-navy/80 font-medium transition-colors duration-200"
                    >
                      + Add another link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = 3;

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
            Let's set up your profile to get started
          </p>
          <div className="mt-4 p-3 bg-blue-50/80 border border-blue-200 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-blue-700">
              💡 You can skip this setup and complete your profile later from
              your dashboard
            </p>
          </div>
        </div>

        <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg px-8 py-8 transform transition-all duration-500 hover:shadow-xl border border-white/40 hover:bg-white/90">
          <form className="space-y-8">
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
                onClick={handleNext}
                disabled={updateProfileMutation.isPending}
                className="px-8 py-2.5 bg-gradient-to-r from-navy via-indigo-600 to-blue-500 text-white text-sm font-medium 
                rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:from-navy hover:to-indigo-500
                active:scale-95 transform shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {updateProfileMutation.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {updateProfileMutation.isPending
                  ? "Saving..."
                  : currentStep === totalSteps
                  ? "Complete Setup"
                  : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
