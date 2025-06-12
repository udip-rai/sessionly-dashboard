import { BASE_API } from "../axios";
import { ADMIN_APIS } from "../index";

// FAQ interface
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Website Stats interface
export interface WebsiteStat {
  _id: string;
  label: string;
  value: string;
  description: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  totalSessions?: number;
  rating?: number;
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

// Static Page interfaces
export interface StaticPageBase {
  _id: string;
  type: "home" | "about";
  title: string;
  content: string; // Stringified JSON content (HomePageContent | AboutPageContent)
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AboutPageContent {
  hero: {
    title: string;
    descriptors: string[];
    description: {
      intro: string;
      stats: string;
      aiMatch: string;
    };
  };
  mission: {
    title: string;
    description: string;
  };
  features: {
    title: {
      why: string;
      choose: string;
    };
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    disclaimer: string;
  };
}

export interface HomePageContent {
  title: string;
  description: string;
  everything_reasons: {
    title: string;
    description: string;
    children: Array<{
      title: string;
      description: string;
    }>;
  };
  transform_reasons: {
    title: string;
    children: string[]; // 4 titles as strings
  };
  advantages_reasons: {
    title: string;
    description: string;
    children: Array<{
      title: string;
      description: string;
    }>;
  };
  powered_by_ai_reasons: {
    title: string;
    description: string;
    children: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
  };
}

export interface AboutPage extends StaticPageBase {
  type: "about";
}

export interface HomePage extends StaticPageBase {
  type: "home";
}

export type StaticPage = AboutPage | HomePage;

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

  // FAQ Management
  async getAllFAQs(): Promise<FAQ[]> {
    try {
      console.log("Making API call to:", ADMIN_APIS.CONTENT.faq.get);
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.faq.get);
      console.log("API response:", response);

      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.faqs && Array.isArray(response.data.faqs)) {
        return response.data.faqs;
      } else {
        console.log("Unexpected response format:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("FAQ API Error:", error);
      console.error("Request URL:", error?.config?.url);
      console.error("Request Method:", error?.config?.method);
      console.error("Response Status:", error?.response?.status);
      console.error("Response Data:", error?.response?.data);
      throw error;
    }
  },

  async createFAQ(faqData: {
    question: string;
    answer: string;
    isPublished?: boolean;
  }): Promise<FAQ> {
    try {
      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.faq.create,
        faqData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateFAQ(
    faqId: string,
    faqData: {
      question?: string;
      answer?: string;
      isPublished?: boolean;
    },
  ): Promise<FAQ> {
    try {
      const response = await BASE_API.put(
        ADMIN_APIS.CONTENT.faq.update(faqId),
        faqData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteFAQ(
    faqId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(
        ADMIN_APIS.CONTENT.faq.delete(faqId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Website Stats Management
  async getAllWebsiteStats(): Promise<WebsiteStat[]> {
    try {
      console.log("Making API call to:", ADMIN_APIS.CONTENT.websiteStats.get);
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.websiteStats.get);
      console.log("Website Stats API response:", response);

      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.stats && Array.isArray(response.data.stats)) {
        return response.data.stats;
      } else {
        console.log("Unexpected response format:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("Website Stats API Error:", error);
      console.error("Request URL:", error?.config?.url);
      console.error("Request Method:", error?.config?.method);
      console.error("Response Status:", error?.response?.status);
      console.error("Response Data:", error?.response?.data);
      throw error;
    }
  },

  async createWebsiteStat(statData: {
    label: string;
    value: string;
    description: string;
    order?: number;
    isPublished?: boolean;
  }): Promise<WebsiteStat> {
    try {
      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.websiteStats.create,
        statData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateWebsiteStat(
    statId: string,
    statData: {
      label?: string;
      value?: string;
      description?: string;
      order?: number;
      isPublished?: boolean;
    },
  ): Promise<WebsiteStat> {
    try {
      const response = await BASE_API.put(
        ADMIN_APIS.CONTENT.websiteStats.update(statId),
        statData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteWebsiteStat(
    statId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(
        ADMIN_APIS.CONTENT.websiteStats.delete(statId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Static Pages Management
  async getAllStaticPages(): Promise<StaticPage[]> {
    try {
      console.log("Making API call to:", ADMIN_APIS.CONTENT.STATIC_PAGES.get);
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.STATIC_PAGES.get);
      console.log("Static Pages API response:", response);

      let rawPages: any[] = [];

      // Handle different response formats
      if (Array.isArray(response.data)) {
        rawPages = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        rawPages = response.data.data;
      } else if (response.data?.pages && Array.isArray(response.data.pages)) {
        rawPages = response.data.pages;
      } else {
        console.log("Unexpected response format:", response.data);
        return [];
      }

      // Return pages as-is since content field already contains stringified JSON
      return rawPages;
    } catch (error: any) {
      console.error("Static Pages API Error:", error);
      console.error("Request URL:", error?.config?.url);
      console.error("Request Method:", error?.config?.method);
      console.error("Response Status:", error?.response?.status);
      console.error("Response Data:", error?.response?.data);
      throw error;
    }
  },

  async createStaticPage(pageData: {
    type: "home" | "about";
    title: string;
    content: HomePageContent | AboutPageContent;
    isPublished?: boolean;
  }): Promise<StaticPage> {
    try {
      // Stringify content before sending to server
      const payload = {
        type: pageData.type,
        title: pageData.title,
        content: JSON.stringify(pageData.content),
        isPublished: pageData.isPublished,
      };

      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.STATIC_PAGES.create,
        payload,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateStaticPage(
    pageId: string,
    pageData: {
      title?: string;
      content?: HomePageContent | AboutPageContent;
      isPublished?: boolean;
    },
  ): Promise<StaticPage> {
    try {
      // Stringify content before sending to server
      const payload = {
        ...(pageData.title && { title: pageData.title }),
        ...(pageData.content && { content: JSON.stringify(pageData.content) }),
        ...(pageData.isPublished !== undefined && {
          isPublished: pageData.isPublished,
        }),
      };

      const response = await BASE_API.put(`static-page/${pageId}`, payload);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteStaticPage(
    pageId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(
        ADMIN_APIS.CONTENT.STATIC_PAGES.delete(pageId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
