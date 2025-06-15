import { api } from "../axios";
import { LOGIN_APIS } from "../index";
import { ProfileStatus } from "../../context/AuthContext";

interface AuthResponse {
  token: string;
  id: string;
  userType: "student" | "staff" | "admin";
  redirectUrl: string;
  profileStatus?: ProfileStatus;
  requireVerification?: boolean;
  userId?: string;
  email?: string;
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>(
      LOGIN_APIS.login,
      credentials,
    );
    return response;
  },

  logout: async () => {
    await api.post(LOGIN_APIS.logout);
  },
};
