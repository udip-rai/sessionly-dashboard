import { api } from "../axios";
import { STUDENT_APIS } from "../index";
import { filterEmptyValues, logFilteredData } from "../../utils/formDataFilter";

export interface StudentSignupData {
  email: string;
  password: string;
  userType: "student";
}

export interface StudentResponse {
  id: string;
  email: string;
  userType: "student";
}

interface StudentSignupResponse {
  redirectUrl: string;
  token: string;
  id: string;
  userType: "student";
}

interface UpdateStudentProfileData {
  username: string;
  phone: string;
  bio: string;
  image: File | null;
  linkedinUrl: string;
  websiteUrl: string;
  otherUrls: string[];
}

interface UpdateProfileResponse {
  profileStatus: {
    isComplete: boolean;
    missingFields: string[];
  };
  message: string;
}

export const studentService = {
  register: async (data: StudentSignupData) => {
    const response = await api.post<StudentSignupResponse>(
      STUDENT_APIS.register,
      data,
    );
    return response;
  },

  updateStudentProfile: async (
    studentId: string,
    data: UpdateStudentProfileData,
  ): Promise<UpdateProfileResponse> => {
    // Filter out empty/null/undefined values before processing
    const filteredData = filterEmptyValues(data);

    // Log the filtering for debugging
    logFilteredData(data, filteredData, "updateStudentProfile");

    const formData = new FormData();
    const endpoint = STUDENT_APIS.updateProfile(studentId);

    // Handle each field explicitly - only append if value exists and is not empty
    if (filteredData.username)
      formData.append("username", filteredData.username);
    if (filteredData.phone) formData.append("phone", filteredData.phone);
    if (filteredData.bio) formData.append("bio", filteredData.bio);
    if (filteredData.linkedinUrl)
      formData.append("linkedinUrl", filteredData.linkedinUrl);
    if (filteredData.websiteUrl)
      formData.append("websiteUrl", filteredData.websiteUrl);

    // Handle otherUrls array - only if it has valid URLs
    if (filteredData.otherUrls && filteredData.otherUrls.length > 0) {
      formData.append("otherUrls", JSON.stringify(filteredData.otherUrls));
    }

    // Handle image file - only if provided
    if (filteredData.image) formData.append("image", filteredData.image);

    // Log final FormData contents for debugging
    console.log("[updateStudentProfile] Final FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const response = await api.patch<UpdateProfileResponse>(
      endpoint,
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
