import { BASE_API } from "../axios";
import { STUDENT_APIS, STAFF_APIS, ADMIN_APIS } from "../index";

interface UserResponse {
  user: {
    id: string;
    username?: string;
    email: string;
    phone?: string;
    bio?: string;
    image?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    otherUrls?: string[];
    emailVerified?: boolean;
    userType: "student" | "staff" | "admin";
    profileStatus?: {
      isComplete: boolean;
      missingFields: string[];
    };
  };
}

export const userService = {
  async getCurrentUser(
    userType: "admin" | "staff" | "student",
  ): Promise<UserResponse> {
    try {
      const endpoint =
        userType === "admin"
          ? ADMIN_APIS.get
          : userType === "staff"
          ? STAFF_APIS.get
          : STUDENT_APIS.get;

      const response = await BASE_API.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
