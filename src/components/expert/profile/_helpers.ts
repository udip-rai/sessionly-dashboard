// Helper functions for social media platforms
import { FiLinkedin, FiGlobe, FiFacebook } from "react-icons/fi";
import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { ExpertData } from "./_types";

// Helper function to get platform icon
export const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return FiLinkedin;
    case "facebook":
      return FiFacebook;
    case "whatsapp":
      return FaWhatsapp;
    case "instagram":
      return FaInstagram;
    case "twitter":
    case "x":
      return FaTwitter;
    case "youtube":
      return FaYoutube;
    case "tiktok":
      return FaTiktok;
    default:
      return FiGlobe;
  }
};

// Helper function to get platform color
export const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return "text-blue-600";
    case "facebook":
      return "text-blue-500";
    case "whatsapp":
      return "text-green-500";
    case "instagram":
      return "text-pink-500";
    case "twitter":
    case "x":
      return "text-blue-400";
    case "youtube":
      return "text-red-500";
    case "tiktok":
      return "text-black";
    default:
      return "text-gray-600";
  }
};

/**
 * Validates the form data and returns an array of error messages
 * @returns Array of validation error messages
 */

// // Required field validations
// if (!formData.username.trim()) {
//   errors.push("Username is required");
// }

// if (!formData.phone.trim()) {
//   errors.push("Phone number is required");
// }

// if (!formData.bio.trim()) {
//   errors.push("Bio is required");
// }

// if (!formData.rate.trim()) {
//   errors.push("Hourly rate is required");
// }

// if (formData.expertiseAreas.length === 0) {
//   errors.push("At least one expertise area is required");
// }
export const validateForm = (formData: ExpertData): string[] => {
  const errors: string[] = [];

  // If CV is provided, validate its format
  if (
    formData.cv &&
    typeof formData.cv === "string" &&
    formData.cv.trim() !== ""
  ) {
    if (!formData.cv.startsWith("data:application/pdf")) {
      errors.push("CV must be in PDF format.");
    }
  }

  // If certificates are provided, validate each one's format
  if (Array.isArray(formData.certificates)) {
    formData.certificates.forEach((cert, index) => {
      if (cert.file) {
        // Handle both string (base64) and File types
        if (
          typeof cert.file === "string" &&
          !cert.file.startsWith("data:application/pdf")
        ) {
          errors.push(`Certificate ${index + 1} must be in PDF format.`);
        } else if (
          cert.file instanceof File &&
          cert.file.type !== "application/pdf"
        ) {
          errors.push(`Certificate ${index + 1} must be in PDF format.`);
        }
      }
    });
  }

  return errors;
};
