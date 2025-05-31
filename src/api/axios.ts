import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../utils/toast";

// Extract values and set defaults
const baseURL = `${import.meta.env.VITE_PUBLIC_BASE_URL}/api/v2`;
const TIMEOUT = 15000; // 15 seconds

// Create the axios instance
export const BASE_API = axios.create({
  baseURL,
  timeout: TIMEOUT,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
BASE_API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    console.log("token", token);

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
BASE_API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors (including JWT expiration)
    if (error.response?.status === 401) {
      const errorData = error.response.data as any;
      const isJwtExpired =
        errorData?.error === "jwt expired" ||
        errorData?.message === "Unauthorized User" ||
        errorData?.message?.includes("expired");

      // Clear auth state
      useAuthStore.getState().logout();

      // Show appropriate message
      if (isJwtExpired) {
        console.warn("Session expired. Redirecting to login...");
        showToast.warning("Your session has expired. Please log in again.");
      } else {
        showToast.error("Authentication failed. Please log in again.");
      }

      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      const errorData = error.response.data as any;
      const isJwtExpired =
        errorData?.error === "jwt expired" ||
        errorData?.message === "Unauthorized User" ||
        errorData?.message?.includes("expired");

      if (isJwtExpired) {
        // Clear auth state
        useAuthStore.getState().logout();

        console.warn("Session expired (403). Redirecting to login...");
        showToast.warning("Your session has expired. Please log in again.");

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      } else {
        // Handle other forbidden access
        console.error("Access forbidden:", error.response.data);
      }

      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

// Request helpers
export const api = {
  get: <T>(url: string, config = {}) =>
    BASE_API.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: any, config = {}) =>
    BASE_API.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: any, config = {}) =>
    BASE_API.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config = {}) =>
    BASE_API.delete<T>(url, config).then((res) => res.data),

  patch: <T>(url: string, data?: any, config = {}) =>
    BASE_API.patch<T>(url, data, config).then((res) => res.data),
};
