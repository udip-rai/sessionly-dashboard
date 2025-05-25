import { api } from "../axios";
import { ProfileStatus } from "../../context/AuthContext";
import { STAFF_APIS } from "../index";
import { CategoriesResponse, ExpertiseArea } from "../../types/expertise";

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
