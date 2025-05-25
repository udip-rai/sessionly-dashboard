import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import Cookies from "js-cookie";

// Extract values and set defaults
const baseURL = `${import.meta.env.VITE_PUBLIC_BASE_URL}/api/v2`;
const TIMEOUT = 15000; // 15 seconds

// Create the axios instance
export const BASE_API = axios.create({
  baseURL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
BASE_API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("auth_token");

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
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth state
      Cookies.remove("auth_token");
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // Handle forbidden access
      console.error("Access forbidden:", error.response.data);
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
