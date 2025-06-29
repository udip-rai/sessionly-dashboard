import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/services/auth.service";
import { studentService } from "../api/services/student.service";
import { expertService } from "../api/services/expert.service";
import { userService } from "../api/services/user.service";
import { useAuthStore } from "../store/useAuthStore";
import Cookies from "js-cookie";

const setAuthToken = (token: string) => {
  Cookies.set("token", token, { expires: 7, secure: true });
};

export function useExpertSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: expertService.register,
    onSuccess: (response) => {
      // Check if email verification is required
      if (response.requireVerification) {
        return response; // Don't set auth state yet
      }

      // Normal flow - set auth state
      setUser({
        id: response.id || response.result?._id || "",
        userType: response.userType || response.result?.userType || "staff",
        redirectUrl: response.redirectUrl,
      });
      if (response.token) {
        setToken(response.token);
        setAuthToken(response.token);
      }
      return response;
    },
    onError: (error: any) => {
      // Let the component handle error display
      throw error;
    },
  });
}

export function useStudentSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: studentService.register,
    onSuccess: (response) => {
      // Check if email verification is required
      if (response.requireVerification) {
        return response; // Don't set auth state yet
      }

      // Normal flow - set auth state
      setUser({
        id: response.id || response.result?._id || "",
        userType: response.userType || response.result?.userType || "student",
        redirectUrl: response.redirectUrl,
      });
      if (response.token) {
        setToken(response.token);
        setAuthToken(response.token);
      }
      return response;
    },
    onError: (error: any) => {
      // Let the component handle error display
      throw error;
    },
  });
}

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        // First get login data which includes token and userType
        const loginData = await authService.login(credentials);

        // Check if email verification is required
        if (loginData.requireVerification) {
          return loginData; // Return immediately without fetching user data
        }

        // Set the token in store
        setToken(loginData.token);

        // Now fetch the complete user data using the correct endpoint based on userType
        const userData = await userService.getCurrentUser(loginData.userType);

        // Store complete user data in auth store
        setUser({
          id: loginData.id,
          userType: loginData.userType,
          redirectUrl: loginData.redirectUrl,
          name:
            userData.user?.username ||
            userData.user?.email?.split("@")[0] ||
            "User",
        });

        // Return combined data
        return {
          ...loginData,
          ...userData,
        };
      } catch (error: any) {
        // Check if the error is due to email not being verified
        const errorData = error?.response?.data;
        if (errorData?.requireVerification) {
          // Return the verification response instead of throwing
          return errorData;
        }

        // Clear auth store in case of other errors
        setToken(null);
        setUser(null);
        throw new Error(errorData?.message || "Invalid credentials");
      }
    },
    onSuccess: (response) => {
      console.log("Login response:", response);

      // If email verification is required, don't set auth state or show success
      if (response.requireVerification) {
        return response;
      }

      // Return response for component to handle success feedback
      return response;
    },
    onError: (error: any) => {
      // Let the component handle error display
      throw error;
    },
  });
}
