// Profile completion tracking utilities

export interface ProfileCompletionStatus {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  completedFields: string[];
  criticalMissing: string[];
  optionalMissing: string[];
}

export interface StudentProfileData {
  username?: string;
  phone?: string;
  bio?: string;
  image?: File | string | null;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
}

export interface ExpertProfileData {
  phone?: string;
  bio?: string;
  image?: File | string | null;
  rate?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  expertiseAreas?: any[];
}

// Required fields for student profile
const STUDENT_REQUIRED_FIELDS = ["username", "bio", "phone"];
const STUDENT_OPTIONAL_FIELDS = [
  "image",
  "linkedinUrl",
  "websiteUrl",
  "otherUrls",
];

// Required fields for expert profile
const EXPERT_REQUIRED_FIELDS = ["bio", "phone", "rate", "expertiseAreas"];
const EXPERT_OPTIONAL_FIELDS = ["image", "linkedinUrl", "websiteUrl"];

// Field display names for better UX
const FIELD_DISPLAY_NAMES: Record<string, string> = {
  username: "Username",
  phone: "Phone Number",
  bio: "Bio",
  image: "Profile Picture",
  linkedinUrl: "LinkedIn Profile",
  websiteUrl: "Website URL",
  otherUrls: "Other Links",
  rate: "Hourly Rate",
  expertiseAreas: "Areas of Expertise",
};

// Minimum character requirements
const MIN_BIO_LENGTH = 50;
const MIN_RATE_VALUE = 0.01;

export function checkStudentProfileCompletion(
  profileData: StudentProfileData,
): ProfileCompletionStatus {
  const allFields = [...STUDENT_REQUIRED_FIELDS, ...STUDENT_OPTIONAL_FIELDS];
  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];
  const optionalMissing: string[] = [];

  // Check each field
  allFields.forEach((field) => {
    const value = profileData[field as keyof StudentProfileData];
    let isComplete = false;

    switch (field) {
      case "username":
      case "phone":
        isComplete = Boolean(value && String(value).trim());
        break;
      case "bio":
        isComplete = Boolean(
          value &&
            String(value).trim() &&
            String(value).length >= MIN_BIO_LENGTH,
        );
        break;
      case "image":
        isComplete = Boolean(value);
        break;
      case "linkedinUrl":
      case "websiteUrl":
        isComplete = Boolean(value && String(value).trim());
        break;
      case "otherUrls":
        isComplete = Boolean(
          Array.isArray(value) && value.some((url) => url && url.trim()),
        );
        break;
    }

    if (isComplete) {
      completedFields.push(field);
    } else {
      missingFields.push(field);
      if (STUDENT_REQUIRED_FIELDS.includes(field)) {
        criticalMissing.push(field);
      } else {
        optionalMissing.push(field);
      }
    }
  });

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields.length / totalFields) * 100,
  );
  const isComplete = criticalMissing.length === 0;

  return {
    isComplete,
    completionPercentage,
    missingFields,
    completedFields,
    criticalMissing,
    optionalMissing,
  };
}

export function checkExpertProfileCompletion(
  profileData: ExpertProfileData,
): ProfileCompletionStatus {
  const allFields = [...EXPERT_REQUIRED_FIELDS, ...EXPERT_OPTIONAL_FIELDS];
  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];
  const optionalMissing: string[] = [];

  // Check each field
  allFields.forEach((field) => {
    const value = profileData[field as keyof ExpertProfileData];
    let isComplete = false;

    switch (field) {
      case "phone":
        isComplete = Boolean(value && String(value).trim());
        break;
      case "bio":
        isComplete = Boolean(
          value &&
            String(value).trim() &&
            String(value).length >= MIN_BIO_LENGTH,
        );
        break;
      case "rate":
        isComplete = Boolean(
          value &&
            parseFloat(String(value).replace(/[^0-9.]/g, "")) >= MIN_RATE_VALUE,
        );
        break;
      case "image":
        isComplete = Boolean(value);
        break;
      case "linkedinUrl":
      case "websiteUrl":
        isComplete = Boolean(value && String(value).trim());
        break;
      case "expertiseAreas":
        isComplete = Boolean(Array.isArray(value) && value.length > 0);
        break;
    }

    if (isComplete) {
      completedFields.push(field);
    } else {
      missingFields.push(field);
      if (EXPERT_REQUIRED_FIELDS.includes(field)) {
        criticalMissing.push(field);
      } else {
        optionalMissing.push(field);
      }
    }
  });

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields.length / totalFields) * 100,
  );
  const isComplete = criticalMissing.length === 0;

  return {
    isComplete,
    completionPercentage,
    missingFields,
    completedFields,
    criticalMissing,
    optionalMissing,
  };
}

export function getFieldDisplayName(fieldName: string): string {
  return FIELD_DISPLAY_NAMES[fieldName] || fieldName;
}

export function getProfileCompletionMessage(
  status: ProfileCompletionStatus,
): string {
  if (status.isComplete) {
    return "Your profile is complete! 🎉";
  }

  if (status.criticalMissing.length > 0) {
    const missingNames = status.criticalMissing.map(getFieldDisplayName);
    if (missingNames.length === 1) {
      return `Please complete your ${missingNames[0]} to finish your profile.`;
    }
    return `Please complete the following required fields: ${missingNames.join(
      ", ",
    )}.`;
  }

  if (status.optionalMissing.length > 0) {
    return `Profile ${
      status.completionPercentage
    }% complete. Consider adding ${status.optionalMissing
      .map(getFieldDisplayName)
      .join(", ")} to improve your profile.`;
  }

  return `Profile ${status.completionPercentage}% complete.`;
}
