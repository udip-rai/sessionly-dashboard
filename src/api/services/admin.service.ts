import { BASE_API } from "../axios";
import { ADMIN_APIS } from "../index";

// Student interface based on actual API response structure
export interface Student {
  _id: string;
  username?: string;
  email: string;
  phone?: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
  image?: string; // API uses 'image' field
  timezone?: string;
  isActive?: boolean; // May not be in API response, handled in transformation
  emailVerified?: boolean;
  userType: "student";
  advisoryTopics?: string[];
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  __v?: number;
}

// Staff interface based on actual API response structure
export interface Staff {
  _id: string;
  username?: string;
  email: string;
  phone?: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
  image?: string; // API uses 'image' field
  cv?: string;
  certificates?: Array<{
    _id: string;
    name: string;
    fileUrl: string;
    issueDate: string;
    description: string;
  }>;
  expertiseAreas?: Array<{
    _id: string;
    category: string; // Category ID
    subCategory: string; // SubCategory ID
  }>;
  rate?: string; // Already formatted like "$50/hour"
  timezone?: string;
  isActive?: boolean; // May not be in API response, handled in transformation
  isApproved: boolean;
  approvedBy?: string | null;
  approvedAt?: string | null;
  emailVerified?: boolean;
  userType: "staff";
  advisoryTopics?: string[];
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  __v?: number;
}

// Updated interfaces based on actual API response structure
export interface StudentsResponse {
  message: string;
  success: boolean;
  data: Student[];
}

export interface StaffResponse {
  message: string;
  success: boolean;
  data: Staff[];
}

export const adminService = {
  async getAllStudents(
    page: number = 1,
    limit: number = 50,
  ): Promise<StudentsResponse> {
    try {
      const response = await BASE_API.get(ADMIN_APIS.getAllStudents, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllStaff(
    page: number = 1,
    limit: number = 50,
  ): Promise<StaffResponse> {
    try {
      const response = await BASE_API.get(ADMIN_APIS.getAllStaff, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserStatus(
    userId: string,
    userType: "student" | "staff",
    status: "active" | "blocked",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const endpoint =
        userType === "student"
          ? `admin/students/${userId}/status`
          : `admin/staff/${userId}/status`;

      const response = await BASE_API.patch(endpoint, {
        isActive: status === "active",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async approveStaff(
    staffId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.post(`admin/staff/approve/${staffId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async rejectStaff(
    staffId: string,
    reason?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.post(`admin/staff/reject/${staffId}`, {
        reason: reason || "",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
