import { api } from "../axios";
import { STAFF_APIS } from "../index";

export interface ExpertSignupData {
  email: string;
  password: string;
  userType: "staff";
}

export interface ExpertResponse {
  id: string;
  email: string;
  userType: "staff";
}

interface ExpertSignupResponse {
  redirectUrl: string;
  token: string;
  id: string;
  userType: "staff";
  requireVerification?: boolean;
  userId?: string;
  email?: string;
  emailSent?: boolean;
  success?: boolean;
  message?: string;
}

export const expertService = {
  register: async (data: ExpertSignupData) => {
    const response = await api.post<ExpertSignupResponse>(
      STAFF_APIS.register,
      data,
    );
    return response;
  },
};
