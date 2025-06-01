import { api } from "../axios";
import { ProfileStatus } from "../../context/AuthContext";
import { STAFF_APIS } from "../index";
import { CategoriesResponse, ExpertiseArea } from "../../types/expertise";
import { ExpertData } from "../../components/expert/profile/types";

interface UpdateStaffProfileData {
  phone: string;
  bio: string;
  linkedinUrl: string;
  websiteUrl: string;
  expertiseAreas: ExpertiseArea[];
  rate: string;
  image: File | null | undefined;
}

interface UpdateProfileResponse {
  profileStatus: ProfileStatus;
  message: string;
}

export const profileService = {
  getExpertiseAreas: async () => {
    return api.get<CategoriesResponse>(STAFF_APIS.getAllExpertiseAreas);
  },

  getStaffProfile: async (): Promise<{ data: ExpertData }> => {
    const response = await api.get(STAFF_APIS.get);
    const userData = (response as any).user;

    // Transform the API response to match ExpertData interface
    const expertData: ExpertData = {
      username: userData.username || "",
      email: userData.email || "",
      phone: userData.phone || "",
      bio: userData.bio || "",
      rate: userData.rate || "",
      profilePicture: userData.image || "", // API uses 'image' field
      linkedinUrl: userData.linkedinUrl || "",
      websiteUrl: userData.websiteUrl || "",
      otherUrls: userData.otherUrls || [],
      advisoryTopics: userData.advisoryTopics || [],
      expertiseAreas: userData.expertiseAreas || [],
      cv: userData.cv || null,
      certificates: userData.certificates || [
        // Sample certificate for testing
        {
          name: "React Development Certification",
          file: null,
          issueDate: "2024-01-15",
          description: "Advanced React development skills certification",
        },
      ],
    };

    return { data: expertData };
  },

  updateStaffProfile: async (staffId: string, data: UpdateStaffProfileData) => {
    const formData = new FormData();

    // Handle each field explicitly
    if (data.phone) formData.append("phone", data.phone);
    if (data.bio) formData.append("bio", data.bio);
    if (data.linkedinUrl) formData.append("linkedinUrl", data.linkedinUrl);
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    if (data.rate) formData.append("rate", data.rate);
    if (data.image) formData.append("image", data.image);

    // Handle expertise areas specifically
    if (data.expertiseAreas && data.expertiseAreas.length > 0) {
      formData.append("expertiseAreas", JSON.stringify(data.expertiseAreas));
    }

    const response = await api.patch<UpdateProfileResponse>(
      STAFF_APIS.updateProfile(staffId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },
};
