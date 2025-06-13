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

// Team interface
export interface Team {
  _id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  socialLinks: string[];
  version: number;
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
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: boolean;
  userType: "student";
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

// Static Pages interfaces
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
    children: string[];
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

export interface TeamPageContent {
  page: {
    title: string;
    highlighted: string;
    subtitle: string;
    description: string;
  };
  stats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
  sections: {
    team: {
      title: string;
      highlighted: string;
      subtitle: string;
    };
    values: {
      title: string;
      highlighted: string;
      subtitle: string;
    };
    join: {
      title: string;
      highlighted: string;
      description: string;
    };
  };
}

export interface StaticPage {
  _id: string;
  type: "home" | "about" | "team";
  title: string;
  content: string; // Content is stored as stringified JSON in the database
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Response interfaces
export interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface StaffResponse {
  data: Staff[];
  total: number;
  page: number;
  limit: number;
}

export const adminService = {
  // User Management
  async getAllStudents(
    page: number = 1,
    limit: number = 10,
  ): Promise<StudentsResponse> {
    try {
      const response = await BASE_API.get(
        `${ADMIN_APIS.getAllStudents}?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllStaff(
    page: number = 1,
    limit: number = 10,
  ): Promise<StaffResponse> {
    try {
      const response = await BASE_API.get(
        `${ADMIN_APIS.getAllStaff}?page=${page}&limit=${limit}`,
      );
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
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // FAQ Management
  async getAllFAQs(): Promise<FAQ[]> {
    try {
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.faq.get);
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.faqs && Array.isArray(response.data.faqs)) {
        return response.data.faqs;
      } else {
        return [];
      }
    } catch (error) {
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
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.websiteStats.get);
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.stats && Array.isArray(response.data.stats)) {
        return response.data.stats;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  async createWebsiteStat(statData: {
    label: string;
    value: string;
    description: string;
    order: number;
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
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.staticPages.get);
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.pages && Array.isArray(response.data.pages)) {
        return response.data.pages;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  async createStaticPage(pageData: {
    type: "home" | "about" | "team";
    title: string;
    content: HomePageContent | AboutPageContent | TeamPageContent;
    isPublished?: boolean;
  }): Promise<StaticPage> {
    try {
      // Stringify the content before sending to API
      const payload = {
        ...pageData,
        content: JSON.stringify(pageData.content),
      };
      
      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.staticPages.create,
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
      content?: HomePageContent | AboutPageContent | TeamPageContent;
      isPublished?: boolean;
    },
  ): Promise<StaticPage> {
    try {
      // Stringify the content before sending to API if it exists
      const payload = {
        ...pageData,
        ...(pageData.content && { content: JSON.stringify(pageData.content) }),
      };
      
      const response = await BASE_API.put(
        ADMIN_APIS.CONTENT.staticPages.update(pageId),
        payload,
      );
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
        ADMIN_APIS.CONTENT.staticPages.delete(pageId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Team Management
  async getAllTeamMembers(): Promise<Team[]> {
    try {
      console.log("Making API call to:", ADMIN_APIS.CONTENT.team.get);
      const response = await BASE_API.get(ADMIN_APIS.CONTENT.team.get);
      console.log("Team API response:", response);

      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.team && Array.isArray(response.data.team)) {
        return response.data.team;
      } else {
        console.log("Unexpected response format:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("Team API Error:", error);
      console.error("Request URL:", error?.config?.url);
      console.error("Request Method:", error?.config?.method);
      console.error("Response Status:", error?.response?.status);
      console.error("Response Data:", error?.response?.data);
      throw error;
    }
  },

  async createTeamMember(teamData: {
    name: string;
    title: string;
    description: string;
    image?: string;
    socialLinks?: string[];
    isPublished?: boolean;
  }): Promise<Team> {
    try {
      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.team.create,
        teamData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateTeamMember(
    teamId: string,
    teamData: {
      name?: string;
      title?: string;
      description?: string;
      image?: string;
      socialLinks?: string[];
      isPublished?: boolean;
    },
  ): Promise<Team> {
    try {
      const response = await BASE_API.put(
        ADMIN_APIS.CONTENT.team.update(teamId),
        teamData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteTeamMember(
    teamId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BASE_API.delete(
        ADMIN_APIS.CONTENT.team.delete(teamId),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // FormData-based team member operations
  async createTeamMemberWithFormData(formData: FormData): Promise<Team> {
    try {
      const response = await BASE_API.post(
        ADMIN_APIS.CONTENT.team.create,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateTeamMemberWithFormData(
    teamId: string,
    formData: FormData,
  ): Promise<Team> {
    try {
      const response = await BASE_API.put(
        ADMIN_APIS.CONTENT.team.update(teamId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
