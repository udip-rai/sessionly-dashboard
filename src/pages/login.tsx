import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../api/services/google-auth.service";
import { useAuthStore } from "../store/useAuthStore";
import AuthHero from "../components/auth/AuthHero";
import {
  FormContainer,
  FormInput,
  FormLabel,
  FormButton,
  FormError,
  FormDivider,
  FormSection,
} from "../components/auth/AuthForm";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
      e.preventDefault();
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section - Left */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] h-screen">
        <AuthHero />
      </div>

      {/* Login Form - Right */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto scroll-smooth">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <FormContainer>
            <div className="flex gap-4 justify-center mb-8">
              <Link
                to="/signup/student"
                className="text-sm font-medium text-navy hover:text-blue-700 transition-colors duration-200"
              >
                Sign up as Student
              </Link>
              <Link
                to="/signup/staff"
                className="text-sm font-medium text-navy hover:text-blue-700 transition-colors duration-200"
              >
                Sign up as Expert
              </Link>
            </div>

            <div className="w-full mb-6">
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

                    // Store auth data
                    setUser({
                      id: response.id,
                      userType: response.userType,
                      redirectUrl: response.redirectUrl,
                    });
                    setToken(response.token);

                    // Navigate based on response
                    if (
                      response.profileStatus &&
                      !response.profileStatus.isComplete
                    ) {
                      navigate(
                        response.userType === "staff"
                          ? "/staff/profile-setup"
                          : "/student/profile-setup",
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

              <FormSection>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </FormSection>

              <FormSection>
                <FormLabel htmlFor="password">Password</FormLabel>
                <div className="relative">
                  <FormInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </FormSection>

              <FormButton type="submit">Sign in</FormButton>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
