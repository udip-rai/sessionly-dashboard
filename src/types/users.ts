// Unified user interface for the UserManagement component
export interface User {
  id?: string;
  _id?: string; // MongoDB ObjectId
  name?: string;
  username?: string;
  email: string;
  phone?: string;
  userType: "student" | "staff"; // Alternative field name
  status: "active" | "inactive" | "blocked";
  joinedDate?: string;
  createdAt?: string;
  timezone?: string;
  totalSessions?: number;
  rating?: number;
  expertiseAreas?:
    | {
        category?: string;
        categoryName?: string;
        subCategory?: string;
        subCategoryName?: string;
        _id?: string;
      }[]
    | string[];
  profilePicture?: string;
  image?: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  otherUrls?: string[];
  rate?: string;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  emailVerified?: boolean;
  googleId?: string;
  certificates?: {
    name: string;
    fileUrl?: string;
    issueDate?: string;
    description?: string;
    _id?: string;
  }[];
  advisoryTopics?: string[];
  cv?: string; // CV/Resume URL
  __v?: number; // MongoDB version key
}

export interface UserFilters {
  type: "all" | "student" | "staff";
  status: "all" | "active" | "inactive" | "blocked";
  searchTerm: string;
}

export interface UserStats {
  totalUsers: number;
  totalStudents: number;
  activeStaff: number;
  pendingApprovals: number;
}
