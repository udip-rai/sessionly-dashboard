// Shared types for profile components
import { ExpertiseArea } from "../../../types/expertise";

export interface Certificate {
  name: string;
  file: string | null;
  issueDate: string;
  description: string;
}

export interface ExpertData {
  username: string;
  email: string;
  phone: string;
  bio: string;
  rate: string;
  profilePicture: string;
  linkedinUrl: string;
  websiteUrl: string;
  otherUrls: string[];
  advisoryTopics: string[];
  expertiseAreas: ExpertiseArea[];
  cv: string | null;
  certificates: Certificate[];
}

export interface ProfileSectionProps {
  formData: ExpertData;
  setFormData: React.Dispatch<React.SetStateAction<ExpertData>>;
  editingField?: string | null;
  setEditingField?: React.Dispatch<React.SetStateAction<string | null>>;
}
