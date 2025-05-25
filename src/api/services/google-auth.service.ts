import { BASE_API } from "../axios";

export const googleAuthService = {
  async signInWithGoogle(idToken: string) {
    try {
      const response = await BASE_API.post("/auth/google/signin", {
        token: idToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async signUpWithGoogle(idToken: string, userType: "student" | "staff") {
    try {
      const response = await BASE_API.post("/auth/google/signup", {
        token: idToken,
        userType: userType,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
