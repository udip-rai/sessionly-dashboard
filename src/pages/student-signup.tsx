import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { useStudentSignup } from "../hooks/useAuth";
import AuthHero from "../components/auth/AuthHero";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { showToast } from "../utils/toast";
import {
  FormButton,
  FormInput,
  FormLabel,
} from "../components/auth/AuthForm";
import { Spinner } from "../components/ui/Spinner";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function StudentSignup() {
  const navigate = useNavigate();
  const studentSignupMutation = useStudentSignup();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

    setError("");
    setIsSubmitting(true);

    try {
      const response = await studentSignupMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        userType: "student",
      });

      // Check if email verification is required
      if (response?.requireVerification) {
        showToast.info(
          "Account created successfully! Please verify your email using the OTP sent to your inbox.",
        );
        navigate("/otp-verification", {
          state: {
            userId: response.result?._id,
            userType: response.result?.userType || "student",
            email: response.result?.email || formData.email,
          },
        });
        return;
      }

      if (response) {
        navigate("/student-dashboard");
      }
    } catch (err: any) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    setIsGoogleLoading(true);
    try {
      if (!credentialResponse.credential) {
        showToast.error("Google authentication failed");
        return;
      }

      // Use the existing signUpWithGoogle method
      const response = await googleAuthService.signUpWithGoogle(
        credentialResponse.credential,
        "student"
      );

      if (response?.requireVerification) {
        showToast.info("Please verify your email using the OTP sent to your inbox.");
        navigate("/otp-verification", {
          state: {
            userId: response.result?._id,
            userType: response.result?.userType || "student",
            email: response.result?.email,
          },
        });
      } else if (response) {
        showToast.success("Account created successfully!");
        navigate("/student-dashboard");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Google signup failed. Please try again.";
      
      // Handle email already exists
      if (errorMessage === "Email already exists") {
        showToast.info("Account already exists. Redirecting to login...");
        navigate("/login");
      } else {
        showToast.error(errorMessage);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col lg:flex-row min-h-screen">        {/* Left side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
          <AuthHero />
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Student Account
              </h2>
              <p className="text-gray-600 text-lg">
                Start your learning journey with expert guidance
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3 text-sm text-blue-700">
                <FiCheckCircle className="w-4 h-4 text-blue-600" />
                <span>Access to 500+ expert mentors</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-700">
                <FiCheckCircle className="w-4 h-4 text-blue-600" />
                <span>Personalized learning paths</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-700">
                <FiCheckCircle className="w-4 h-4 text-blue-600" />
                <span>1-on-1 mentoring sessions</span>
              </div>
            </div>

            {/* Google Signup */}
            <div className="space-y-4">
              <div className="relative">
                {isGoogleLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <span className="text-sm text-gray-600">
                        Signing up with Google...
                      </span>
                    </div>
                  </div>
                )}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setIsGoogleLoading(false);
                    showToast.error("Google signup failed");
                  }}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500 font-medium">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <FormLabel
                  htmlFor="email"
                  className="flex items-center gap-2 mb-2"
                >
                  <FiMail className="w-4 h-4 text-gray-500" />
                  Email Address
                </FormLabel>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <FormLabel
                  htmlFor="password"
                  className="flex items-center gap-2 mb-2"
                >
                  <FiLock className="w-4 h-4 text-gray-500" />
                  Password
                </FormLabel>
                <div className="relative">
                  <FormInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <FormLabel htmlFor="confirmPassword" className="mb-2">
                  Confirm Password
                </FormLabel>
                <div className="relative">
                  <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <FormButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Creating Account..."
                  disabled={isSubmitting}
                  className="group relative overflow-hidden"
                >
                  <span className="flex items-center justify-center gap-2">
                    Create Student Account
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </FormButton>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="underline hover:text-gray-700 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="underline hover:text-gray-700 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
