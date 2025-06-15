import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiMail, FiRefreshCw } from "react-icons/fi";
import { BASE_API } from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../utils/toast";
import AuthHero from "../components/auth/AuthHero";
import { LOGIN_APIS } from "../api";

interface OTPPageState {
  userId: string;
  userType: "student" | "staff";
  email: string;
}

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();
  // Get state from navigation or redirect to login if not available
  const state = location.state as OTPPageState;

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  // Create refs for each OTP input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to login if no state is provided
  useEffect(() => {
    if (!state?.userId || !state?.userType || !state?.email) {
      navigate("/login");
    }
  }, [state, navigate]);

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value.slice(-1); // Only take the last character
    setOtpDigits(newOtpDigits);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/\D/g, "").slice(0, 6);

    const newOtpDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < numericData.length; i++) {
      newOtpDigits[i] = numericData[i];
    }
    setOtpDigits(newOtpDigits);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtpDigits.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // Get OTP as string
  const otp = otpDigits.join("");
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");
    try {
      const response = await BASE_API.post("/verify-email", {
        userId: state.userId,
        userType: state.userType,
        otp,
      });

      const data = response.data as any;

      if (data.success) {
        // Set user and token if provided
        if (data.token) {
          setToken(data.token);
        }

        if (data.user) {
          setUser({
            id: data.user.id || state.userId,
            userType: state.userType,
            name:
              data.user.username || data.user.email?.split("@")[0] || "User",
          });
        }

        showToast.success("Email verified successfully!");

        // Navigate based on user type and profile completion
        if (data.profileStatus && !data.profileStatus.isComplete) {
          navigate(
            state.userType === "staff"
              ? "/staff-dashboard/profile-setup"
              : "/student-dashboard/profile-setup",
          );
        } else {
          navigate(
            `/${
              state.userType === "staff" ? "expert" : state.userType
            }-dashboard`,
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setError("");
    try {
      const response = await BASE_API.post(LOGIN_APIS.resendOTP, {
        userId: state.userId,
        userType: state.userType,
      });

      const data = response.data as any;

      if (data.success) {
        showToast.success(
          `Verification code sent to ${data.email || state.email}`,
        );
        setResendTimer(120); // 2 minutes countdown
        setOtpDigits(["", "", "", "", "", ""]); // Clear current OTP
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!state) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Hero Section - Left */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] h-screen">
        <AuthHero />
      </div>

      {/* OTP Form - Right */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white/80 backdrop-blur-xl flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto scrollbar-thin">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white/90 backdrop-blur-xl z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors duration-200 mb-4"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Email Display */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Verification code sent to:
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    {state.email}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-100">
                  {error}
                </div>
              )}{" "}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-4 text-center">
                  Verification Code
                </label>
                <div
                  className="flex justify-center space-x-3 mb-4"
                  onPaste={handlePaste}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-xl
                      transition-all duration-300 ease-in-out bg-white/90
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                      hover:border-blue-300 hover:shadow-md hover:bg-white
                      disabled:opacity-50 disabled:cursor-not-allowed"
                      autoComplete="off"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6 || isVerifying}
                className="relative w-full flex justify-center items-center px-6 py-3.5 mt-6
                bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 
                text-white text-sm font-semibold rounded-xl shadow-lg
                transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl
                focus:outline-none focus:ring-4 focus:ring-blue-600/30 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                group overflow-hidden transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isVerifying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
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
                    </>
                  )}
                </span>
                <div className="absolute inset-0 border border-white/20 rounded-xl"></div>
              </button>
              {/* Resend OTP */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isResending}
                  className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
                  />
                  {resendTimer > 0
                    ? `Resend in ${formatTime(resendTimer)}`
                    : "Resend Code"}
                </button>
                {resendTimer === 0 && (
                  <p className="text-xs text-gray-500">
                    You can request a new code every 2 minutes
                  </p>
                )}
              </div>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                The verification code expires in 1 hour
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
