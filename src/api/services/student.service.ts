import { api } from "../axios";
import { STUDENT_APIS } from "../index";

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
    const formData = new FormData();
    const endpoint = STUDENT_APIS.updateProfile(studentId);

    // Handle each field explicitly
    if (data.username) formData.append("username", data.username);
    if (data.phone) formData.append("phone", data.phone);
    if (data.bio) formData.append("bio", data.bio);
    if (data.linkedinUrl) formData.append("linkedinUrl", data.linkedinUrl);
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    if (data.otherUrls && data.otherUrls.length > 0) {
      formData.append(
        "otherUrls",
        JSON.stringify(data.otherUrls.filter((url) => url.trim() !== "")),
      );
    }
    if (data.image) formData.append("image", data.image);

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
