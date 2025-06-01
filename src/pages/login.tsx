import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { userService } from "../api/services/user.service";
import { useLogin } from "../hooks/useAuth";
import AuthHero from "../components/auth/AuthHero";
import {
  FormContainer,
  FormError,
  FormDivider,
  FormButton,
} from "../components/auth/AuthForm";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginMutation.mutateAsync({ email, password });

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
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Hero Section - Left */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] h-screen">
        <AuthHero />
      </div>

      {/* Login Form - Right */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white/80 backdrop-blur-xl flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto scrollbar-thin">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white/90 backdrop-blur-xl z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <FormContainer>
            <div className="w-full mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={async (
                  credentialResponse: GoogleCredentialResponse,
                ) => {
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
                    const userData = await userService.getCurrentUser(
                      response.userType,
                    );

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

                    // Navigate based on response
                    if (
                      response.profileStatus &&
                      !response.profileStatus.isComplete
                    ) {
                      navigate(
                        response.userType === "staff"
                          ? "/staff-dashboard/profile-setup"
                          : "/student-dashboard/profile-setup",
                      );
                    } else {
                      navigate(
                        response.redirectUrl ||
                          `/${response.userType}-dashboard`,
                      );
                    }
                  } catch (error) {
                    setError("Failed to login with Google. Please try again.");
                    console.error("Error during Google login:", error);
                  }
                }}
                onError={() => {
                  setError("Failed to login with Google. Please try again.");
                }}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <FormDivider />

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <FormError>{error}</FormError>}

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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
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
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full px-4 py-3 border border-gray-200/60 rounded-xl shadow-sm text-sm
                    transition-all duration-300 ease-in-out bg-white/80
                    focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-transparent
                    hover:border-navy/30 hover:shadow-md hover:bg-white/90
                    placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <FormButton
                type="submit"
                isLoading={loginMutation.isPending}
                loadingText="Signing in..."
                className="relative w-full flex justify-center items-center px-6 py-3.5 mt-8
                bg-gradient-to-r from-navy via-indigo-600 to-blue-500 
                text-white text-sm font-semibold rounded-xl shadow-lg
                transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl
                focus:outline-none focus:ring-4 focus:ring-navy/30 focus:ring-offset-2
                group overflow-hidden transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Sign in
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 border border-white/20 rounded-xl"></div>
              </FormButton>

              <div className="mt-8 space-y-4">
                <p className="text-sm text-gray-600 text-center font-medium">
                  Don't have an account yet?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/signup/student"
                    className="relative flex items-center justify-center px-4 py-3 border border-gray-200/60 rounded-xl bg-white/80 hover:bg-white/90 hover:border-navy/30 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm overflow-hidden transform hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center relative z-10">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors duration-300">
                        Sign up as Student
                      </p>
                      <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                        Find your perfect mentor
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/signup/staff"
                    className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200/60 hover:border-navy/30 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm overflow-hidden transform hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/10 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center relative z-10">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors duration-300">
                        Sign up as Expert
                      </p>
                      <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                        Share your expertise
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
