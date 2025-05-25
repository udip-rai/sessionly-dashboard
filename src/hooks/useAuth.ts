import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/services/auth.service";
import { studentService } from "../api/services/student.service";
import { expertService } from "../api/services/expert.service";
import { userService } from "../api/services/user.service";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../utils/toast";
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
      setUser({
        id: response.id,
        userType: response.userType,
        redirectUrl: response.redirectUrl,
      });
      setToken(response.token);
      setAuthToken(response.token);
      showToast.success("Expert account created successfully!");
      return response;
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Failed to create expert account",
      );
    },
  });
}

export function useStudentSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: studentService.register,
    onSuccess: (response) => {
      setUser({
        id: response.id,
        userType: response.userType,
        redirectUrl: response.redirectUrl,
      });
      setToken(response.token);
      setAuthToken(response.token);
      showToast.success("Student account created successfully!");
      return response;
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Failed to create student account",
      );
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
        // Clear auth store in case of error
        setToken(null);
        setUser(null);
        throw new Error(
          error?.response?.data?.message || "Invalid credentials",
        );
      }
    },
    onSuccess: (response) => {
      console.log("response", response);
      setUser({
        id: response.id,
        userType: response.userType,
        redirectUrl: response.redirectUrl,
      });
      setToken(response.token);
      setAuthToken(response.token);
      showToast.success("Logged in successfully!");
      return response;
    },
    onError: (error: any) => {
      showToast.error(error.message);
    },
  });
}
