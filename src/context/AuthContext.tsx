import { createContext, useContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useExpertSignup, useStudentSignup, useLogin } from "../hooks/useAuth";

export interface ProfileStatus {
  isComplete: boolean;
  missingFields: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  userRole: "admin" | "staff" | "student" | null;
  signup: (data: any) => Promise<boolean>;
  profileStatus: ProfileStatus | null;
  updateProfileStatus: (status: ProfileStatus) => void;
  user: {
    id: string;
    userType: "student" | "staff" | "admin";
    redirectUrl?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, token, logout: storeLogout } = useAuthStore();
  const expertSignup = useExpertSignup();
  const studentSignup = useStudentSignup();
  const loginMutation = useLogin();
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(
    null,
  );

  const login = async (credentials: { email: string; password: string }) => {
    const response = await loginMutation.mutateAsync(credentials);

    // If email verification is required, return the response without navigation
    if (response.requireVerification) {
      return response;
    }

    // Store profile status from response
    if (response.profileStatus) {
      setProfileStatus(response.profileStatus);
    }

    // Navigate based on profile completion and user type
    if (response.profileStatus && !response.profileStatus.isComplete) {
      if (response.userType === "staff") {
        navigate("/staff/profile-setup");
      } else if (response.userType === "student") {
        navigate("/student/profile-setup");
      }
    } else {
      navigate(response.redirectUrl || `/${response.userType}-dashboard`);
    }

    return response;
  };

  const signup = async (data: any) => {
    try {
      let response;
      if (data.userType === "staff") {
        response = await expertSignup.mutateAsync(data);
      } else {
        response = await studentSignup.mutateAsync(data);
      }
      navigate(
        response.redirectUrl ||
          `/${
            response.userType || response.result?.userType || data.userType
          }-dashboard`,
      );
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    storeLogout();
    setProfileStatus(null);
    navigate("/login");
  };

  const updateProfileStatus = (status: ProfileStatus) => {
    setProfileStatus(status);
    if (status.isComplete && user) {
      navigate(`/${user.userType}-dashboard`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        logout,
        userRole: user?.userType || null,
        signup,
        profileStatus,
        updateProfileStatus,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
