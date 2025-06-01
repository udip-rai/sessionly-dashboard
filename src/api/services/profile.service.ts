import { api } from "../axios";
import { ProfileStatus } from "../../context/AuthContext";
import { STAFF_APIS } from "../index";
import { CategoriesResponse, ExpertiseArea } from "../../types/expertise";
import { ExpertData } from "../../components/expert/profile/_types";
import {
  filterEmptyValues,
  filterValidCertificates,
  logFilteredData,
} from "../../utils/formDataFilter";

interface UpdateStaffProfileData {
  username: string;
  phone: string;
  bio: string;
  linkedinUrl: string;
  websiteUrl: string;
  expertiseAreas: ExpertiseArea[];
  rate: string;
  image: File | string | null | undefined;
  otherUrls: string[];
  advisoryTopics: string[];
  cv: File | string | null | undefined;
  certificates: Array<{
    name: string;
    file: File | string | null;
    issueDate: string;
    description: string;
  }>;
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
      image: userData.image || "", // API uses 'image' field
      linkedinUrl: userData.linkedinUrl || "",
      websiteUrl: userData.websiteUrl || "",
      otherUrls: userData.otherUrls || [],
      advisoryTopics: userData.advisoryTopics || [],
      expertiseAreas: userData.expertiseAreas || [],
      cv: userData.cv || null,
      certificates: userData.certificates || [],
    };

    return { data: expertData };
  },

  updateStaffProfile: async (staffId: string, data: UpdateStaffProfileData) => {
    // Filter out empty/null/undefined values before processing
    const filteredData = filterEmptyValues(data);

    // Log the filtering for debugging
    logFilteredData(data, filteredData, "updateStaffProfile");

    const formData = new FormData();

    // Handle basic text fields - only append if value exists and is not empty
    if (filteredData.username)
      formData.append("username", filteredData.username);
    if (filteredData.phone) formData.append("phone", filteredData.phone);
    if (filteredData.bio) formData.append("bio", filteredData.bio);
    if (filteredData.linkedinUrl)
      formData.append("linkedinUrl", filteredData.linkedinUrl);
    if (filteredData.websiteUrl)
      formData.append("websiteUrl", filteredData.websiteUrl);
    if (filteredData.rate) formData.append("rate", filteredData.rate);

    // Handle array fields as JSON strings - only if arrays have content
    if (filteredData.otherUrls && filteredData.otherUrls.length > 0) {
      formData.append("otherUrls", JSON.stringify(filteredData.otherUrls));
    }
    if (filteredData.advisoryTopics && filteredData.advisoryTopics.length > 0) {
      formData.append(
        "advisoryTopics",
        JSON.stringify(filteredData.advisoryTopics),
      );
    }
    if (filteredData.expertiseAreas && filteredData.expertiseAreas.length > 0) {
      formData.append(
        "expertiseAreas",
        JSON.stringify(filteredData.expertiseAreas),
      );
    }

    // Handle profile image (File object or base64 string) - only if provided
    if (filteredData.image) {
      if (filteredData.image instanceof File) {
        formData.append("image", filteredData.image);
      } else if (
        typeof filteredData.image === "string" &&
        filteredData.image.startsWith("data:")
      ) {
        // Convert base64 to blob and append
        const response = await fetch(filteredData.image);
        const blob = await response.blob();
        formData.append("image", blob, "profile-image");
      }
    }

    // Handle CV file (File object or base64 string) - only if provided
    if (filteredData.cv) {
      if (filteredData.cv instanceof File) {
        formData.append("cv", filteredData.cv);
      } else if (
        typeof filteredData.cv === "string" &&
        filteredData.cv.startsWith("data:")
      ) {
        // Convert base64 to blob and append
        const response = await fetch(filteredData.cv);
        const blob = await response.blob();
        formData.append("cv", blob, "curriculum-vitae.pdf");
      }
    }

    // Handle certificates (array of objects with files) - only if valid certificates exist
    if (filteredData.certificates && filteredData.certificates.length > 0) {
      // Filter out invalid certificates
      const validCertificates = filterValidCertificates(
        filteredData.certificates,
      );

      if (validCertificates.length > 0) {
        // Send certificate metadata as JSON
        const certificateData = [];

        for (let i = 0; i < validCertificates.length; i++) {
          const cert = validCertificates[i];
          certificateData.push({
            name: cert.name,
            issueDate: cert.issueDate,
            description: cert.description,
          });

          // Handle certificate file (File object or base64 string)
          if (cert.file) {
            if (cert.file instanceof File) {
              formData.append(`certificate_${i}`, cert.file);
            } else if (
              typeof cert.file === "string" &&
              cert.file.startsWith("data:")
            ) {
              // Convert base64 to blob and append
              const response = await fetch(cert.file);
              const blob = await response.blob();
              formData.append(`certificate_${i}`, blob, `certificate-${i}.pdf`);
            }
          }
        }

        formData.append("certificates", JSON.stringify(certificateData));
      }
    }

    // Log final FormData contents for debugging
    console.log("[updateStaffProfile] Final FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
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
