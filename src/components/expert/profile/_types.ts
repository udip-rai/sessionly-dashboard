// Shared types for profile components
import { ExpertiseArea } from "../../../types/expertise";

export interface Certificate {
  name: string;
  file?: File | string | null;
  issueDate: string;
  description: string;
  _id?: string;
  fileUrl?: string;
}

export interface CertificateFormData {
  name: string;
  description: string;
  issueDate: string;
}

export interface ProfileSetupProps {
  onComplete: () => void;
  profileStatus: {
    isComplete: boolean;
    missingFields: string[];
  };
}

export interface StepProps {
  currentStep: number;
  totalSteps: number;
}

export interface ExpertData {
  username: string;
  email: string;
  phone: string;
  bio: string;
  rate: string;
  image: string;
  linkedinUrl: string;
  websiteUrl: string;
  otherUrls: string[];
  expertiseAreas: ExpertiseArea[];
  cv: string | null;
  certificates: Certificate[];
  advisoryTopics: string[];
}

export interface ProfileSectionProps {
  formData: ExpertData;
  setFormData: React.Dispatch<React.SetStateAction<ExpertData>>;
  editingField?: string | null;
  setEditingField?: React.Dispatch<React.SetStateAction<string | null>>;
}
