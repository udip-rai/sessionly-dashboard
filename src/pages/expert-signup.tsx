import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useExpertSignup } from "../hooks/useAuth";
import AuthHero from "../components/auth/AuthHero";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { userService } from "../api/services/user.service";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../utils/toast";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function ExpertSignup() {
  const navigate = useNavigate();
  const { mutate: signup } = useExpertSignup();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { confirmPassword, ...signupData } = formData;

      signup(
        {
          ...signupData,
          userType: "staff" as const,
        },
        {
          onSuccess: (response) => {
            // Check if email verification is required
            if (response?.requireVerification) {
              showToast.info(
                "Account created successfully! Please verify your email using the OTP sent to your inbox.",
              );
              navigate("/otp-verification", {
                state: {
                  userId: response.result?._id,
                  userType: response.result?.userType || "staff",
                  email: response.result?.email || formData.email,
                },
              });
              return;
            }

            if (response) {
              navigate("/expert-dashboard");
            } else {
              setError("Failed to create account. Please try again.");
            }
            setIsSubmitting(false);
          },
          onError: (err: any) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "An error occurred during registration";

            // Check if it's an email already exists error
            if (errorMessage === "Email already exists") {
              showToast.info(
                "This email is already registered. Please log in instead.",
              );
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            } else {
              setError(errorMessage);
            }
            setIsSubmitting(false);
          },
        },
      );
    } catch (err: any) {
      const errorMessage =
        err?.message || "An error occurred during registration";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section - Left */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Expert Account
            </h2>
            <p className="text-sm text-gray-600">
              Join our community of mentors
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="w-full">
              <GoogleLogin
                onSuccess={async (
                  credentialResponse: GoogleCredentialResponse,
                ) => {
                  try {
                    if (!credentialResponse.credential) {
                      throw new Error("No credentials received from Google");
                    }
                    const response = await googleAuthService.signUpWithGoogle(
                      credentialResponse.credential,
                      "staff",
                    );

                    // Store auth token first so it's available for subsequent API calls
                    setToken(response.token);

                    // Now fetch user data with the new token
                    const userData = await userService.getCurrentUser("staff");

                    // Store complete user data
                    setUser({
                      id: response.id,
                      userType: response.userType,
                      redirectUrl: response.redirectUrl,
                      name:
                        userData?.user?.username ||
                        userData?.user?.email?.split("@")[0] ||
                        "User",
                    });

                    // Navigate based on profile status
                    if (
                      response.profileStatus &&
                      !response.profileStatus.isComplete
                    ) {
                      navigate("/staff/profile-setup");
                    } else {
                      navigate(response.redirectUrl || "/expert-dashboard");
                    }
                  } catch (error: unknown) {
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Failed to sign up with Google. Please try again.";

                    setError(errorMessage);
                    console.error("Error during Google signup:", error);
                  }
                }}
                onError={() => {
                  setError("Failed to sign up with Google. Please try again.");
                  console.error("Google OAuth Sign-in failed");
                }}
                useOneTap
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-xs text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Rest of the form */}
            {error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hero Section - Right */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] h-screen">
        <AuthHero />
      </div>
    </div>
  );
}
