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

export interface ExpertSignupResponse {
  message: string;
  result: {
    _id: string;
    username: string;
    email: string;
    userType: "staff";
    emailVerified: boolean;
    otherUrls: string[];
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  success: boolean;
  requireVerification: boolean;
  emailSent: boolean;
  // Legacy fields for backward compatibility
  redirectUrl?: string;
  token?: string;
  id?: string;
  userId?: string;
  userType?: "staff";
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
