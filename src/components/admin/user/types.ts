import { User, UserFilters } from "../../../types/users";

// Component-specific types
export interface UserCardProps {
  user: User;
  onUserClick: (user: User) => void;
}

export interface UserStatsGridProps {
  stats: {
    totalUsers: number;
    totalStudents: number;
    activeStaff: number;
    pendingApprovals: number;
  };
}

export interface UserFiltersProps {
  filters: {
    type: "all" | "student" | "staff";
    status: "all" | "active" | "inactive" | "blocked";
    searchTerm: string;
  };
  onFilterChange: (key: keyof UserFilters, value: string) => void;
}

export interface UserGridProps {
  users: User[];
  onUserClick: (user: User) => void;
  sortBy: "name" | "date";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "name" | "date") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export interface UserProfileModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string, name: string) => void;
  onImageZoom?: (imageSrc: string, userName: string) => void;
}

export interface UserRejectionDialogProps {
  isOpen: boolean;
  staffName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

// Modal states
export interface ImageZoomModalState {
  isOpen: boolean;
  imageSrc: string;
  userName: string;
}

export interface ProfileModalState {
  isOpen: boolean;
  user: User | null;
}

export interface RejectionDialogState {
  isOpen: boolean;
  staffId: string;
  staffName: string;
}
