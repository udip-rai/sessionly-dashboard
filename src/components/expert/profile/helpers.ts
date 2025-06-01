// Helper functions for social media platforms
import {
  FiLinkedin,
  FiGlobe,
  FiFacebook,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

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
