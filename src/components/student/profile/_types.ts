export interface StudentData {
  _id?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  image?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
  emailVerified?: boolean;
  userType?: "student";
}

export interface ProfileSectionProps {
  formData: StudentData;
  setFormData: React.Dispatch<React.SetStateAction<StudentData>>;
  editingField?: string | null;
  setEditingField?: React.Dispatch<React.SetStateAction<string | null>>;
  originalData?: StudentData;
}
