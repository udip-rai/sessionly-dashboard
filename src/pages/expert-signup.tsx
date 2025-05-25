import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/auth/AuthHero";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { userService } from "../api/services/user.service";
import { useAuthStore } from "../store/useAuthStore";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function ExpertSignup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const success = await signup({
        ...signupData,
        userType: "staff" as const,
      });

      if (success) {
        navigate("/expert-dashboard");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Form Section - Left */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white/80 backdrop-blur-xl flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto scrollbar-thin">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white/90 backdrop-blur-xl z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Create Expert Account
            </h2>
            <p className="text-sm text-gray-600">
              Join our community of mentors
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="w-full flex justify-center">
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

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800"
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
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-800"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-4 py-3
                  bg-gradient-to-r from-navy via-indigo-600 to-blue-500 
                  text-white text-sm font-medium rounded-xl
                  transition-all duration-300 ease-in-out hover:scale-[1.02] 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy
                  disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl
                  disabled:hover:scale-100"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-navy transition-colors duration-200 flex items-center justify-center gap-2 group"
                >
                  Already have an account?{" "}
                  <span className="font-semibold text-navy group-hover:text-blue-700">
                    Sign in
                  </span>
                </Link>
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
