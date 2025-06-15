import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiLogIn,
  FiArrowRight,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { userService } from "../api/services/user.service";
import { showToast } from "../utils/toast";
import AuthHero from "../components/auth/AuthHero";
import { useLogin } from "../hooks/useAuth";
import { FormButton, FormInput, FormLabel } from "../components/auth/AuthForm";
import { Spinner } from "../components/ui/Spinner";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          setIsLoading(false); // Check if email verification is required
          if (response.requireVerification) {
            showToast.info(
              "Your email is not verified yet. Please verify using the OTP sent to your email.",
            );
            navigate("/otp-verification", {
              state: {
                userId: response.userId || response.id,
                userType: response.userType,
                email: response.email || email,
              },
            });
            return;
          }

          // Show success toast for successful login
          showToast.success("Welcome back!");

          // Navigation is handled by the login function in useAuth
        },
        onError: (err: any) => {
          setIsLoading(false);
          const errorResponse = err?.response?.data;

          // Check if the error indicates email not verified
          if (errorResponse?.requireVerification) {
            showToast.info(
              "Your email is not verified yet. Please verify using the OTP sent to your email.",
            );
            navigate("/otp-verification", {
              state: {
                userId: errorResponse.userId,
                userType: errorResponse.userType,
                email: errorResponse.email || email,
              },
            });
            return;
          }
          const errorMessage =
            errorResponse?.message || "Invalid credentials. Please try again.";
          showToast.error(errorMessage);
          setError(errorMessage);
        },
      },
    );
  };

  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    setIsGoogleLoading(true);
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credentials received from Google");
      }
      const response = await googleAuthService.signInWithGoogle(
        credentialResponse.credential,
      );

      // Store auth token first so it's available for subsequent API calls
      setToken(response.token);

      // Now fetch user data with the new token
      const userData = await userService.getCurrentUser(response.userType);

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

      showToast.success("Welcome back!");

      // Navigate based on response
      if (response.profileStatus && !response.profileStatus.isComplete) {
        navigate(
          response.userType === "staff"
            ? "/staff-dashboard/profile-setup"
            : "/student-dashboard/profile-setup",
        );
      } else {
        navigate(response.redirectUrl || `/${response.userType}-dashboard`);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to login with Google. Please try again.";
      showToast.error(errorMessage);
      setError(errorMessage);
      console.error("Error during Google login:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
          <AuthHero />
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FiLogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to your account to continue
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  10K+ Users
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <FiShield className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  Secure
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <FiZap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-xs font-semibold text-gray-700">Fast</div>
              </div>
            </div>

            {/* Google Login */}
            <div className="space-y-4">
              <div className="relative">
                {isGoogleLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <span className="text-sm text-gray-600">
                        Signing in with Google...
                      </span>
                    </div>
                  </div>
                )}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setIsGoogleLoading(false);
                    showToast.error(
                      "Failed to login with Google. Please try again.",
                    );
                    setError("Failed to login with Google. Please try again.");
                  }}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
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

            {/* Login Form */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel
                    htmlFor="password"
                    className="flex items-center gap-2"
                  >
                    <FiLock className="w-4 h-4 text-gray-500" />
                    Password
                  </FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FormInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <FormButton
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  disabled={isLoading}
                  className="group relative overflow-hidden"
                >
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </FormButton>
              </div>
            </form>

            {/* Sign up links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account yet?
              </p>{" "}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup/student"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                >
                  Sign up as Student
                </Link>{" "}
                <Link
                  to="/signup/expert"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                >
                  Become an Expert
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                By signing in, you agree to our{" "}
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
