import {
  FiUser,
  FiBriefcase,
  FiFileText,
  FiTarget,
  FiLink,
  FiMessageSquare,
} from "react-icons/fi";

export const EXPERT_TABS = [
  {
    id: "basic",
    label: "Basic Info",
    icon: FiUser,
    description: "Personal details and profile picture",
  },
  {
    id: "professional",
    label: "Professional",
    icon: FiBriefcase,
    description: "Bio, rate, and work information",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FiFileText,
    description: "CV and certificates",
  },
  {
    id: "expertise",
    label: "Expertise",
    icon: FiTarget,
    description: "Areas of expertise and skills",
  },
  {
    id: "advisory",
    label: "Advisory Topics",
    icon: FiMessageSquare,
    description: "Topics you can provide advice on",
  },
  {
    id: "social",
    label: "Social Links",
    icon: FiLink,
    description: "LinkedIn, website, and other URLs",
  },
];

export const INITIAL_EXPERT_DATA = {
  username: "",
  email: "",
  phone: "",
  bio: "",
  rate: "",
  image: "",
  linkedinUrl: "",
  websiteUrl: "",
  otherUrls: [],
  advisoryTopics: [],
  expertiseAreas: [],
  cv: null,
  certificates: [],
};
