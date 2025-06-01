import { useEffect, useState } from "react";
import { FiLoader, FiAlertCircle, FiUsers } from "react-icons/fi";
import { useUserManagementStore } from "../../store/useUserManagementStore";
import { ImageZoomModal } from "../ui/ImageZoomModal";
import {
  UserStatsGrid,
  UserFilters,
  UserGrid,
  UserRejectionDialog,
  UserProfileModal,
} from "./user";
import type {
  RejectionDialogState,
  ProfileModalState,
  ImageZoomModalState,
} from "./user/types";

export function UserManagement() {
  const {
    filteredUsers,
    stats,
    filters,
    isLoading,
    error,
    updateFilter,
    approveStaff,
    rejectStaff,
    forceRefresh,
  } = useUserManagementStore();

  // State for modals and dialogs
  const [rejectDialog, setRejectDialog] = useState<RejectionDialogState>({
    isOpen: false,
    staffId: "",
    staffName: "",
  });

  const [imageZoomModal, setImageZoomModal] = useState<ImageZoomModalState>({
    isOpen: false,
    imageSrc: "",
    userName: "",
  });

  const [profileModal, setProfileModal] = useState<ProfileModalState>({
    isOpen: false,
    user: null,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Wrapped filter handler to reset status when switching user types
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "type") {
      // Reset status filter when switching user types
      updateFilter("status", "all");
      updateFilter(key, value);
    } else {
      updateFilter(key, value);
    }
  };

  // Sort and display users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = (a.name || a.username || "").toLowerCase();
      const nameB = (b.name || b.username || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else {
      const dateA = new Date(a.createdAt || a.joinedDate || 0).getTime();
      const dateB = new Date(b.createdAt || b.joinedDate || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  const displayUsers = sortedUsers;

  // Handle stats box click for navigation
  const handleStatBoxClick = (
    boxType:
      | "totalUsers"
      | "pendingApprovals"
      | "activeStaff"
      | "totalStudents",
  ) => {
    switch (boxType) {
      case "totalUsers":
        // Navigate to All Users view
        handleFilterChange("type", "all");
        handleFilterChange("status", "all");
        break;
      case "pendingApprovals":
        // Navigate to Experts Pending view
        handleFilterChange("type", "staff");
        handleFilterChange("status", "inactive");
        break;
      case "activeStaff":
        // Navigate to Active Experts view
        handleFilterChange("type", "staff");
        handleFilterChange("status", "active");
        break;
      case "totalStudents":
        // Navigate to Students view
        handleFilterChange("type", "student");
        handleFilterChange("status", "all");
        break;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Always force refresh on initial load to avoid stale data
        await forceRefresh();
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadData();
  }, []); // Empty dependency array to run only on mount

  // Handle body scroll when modals are open
  useEffect(() => {
    if (profileModal.isOpen || rejectDialog.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [profileModal.isOpen, rejectDialog.isOpen]);

  // Handle staff approval
  const handleStaffApproval = async (staffId: string) => {
    try {
      await approveStaff(staffId);
    } catch (error: any) {
      console.error("Failed to approve staff:", error);
    }
  };

  // Handle staff rejection - Open dialog first
  const handleStaffRejection = (staffId: string, staffName: string) => {
    setRejectDialog({
      isOpen: true,
      staffId,
      staffName,
    });
  };

  // Confirm staff rejection with reason
  const confirmStaffRejection = async (reason: string) => {
    try {
      await rejectStaff(rejectDialog.staffId, reason);
      setRejectDialog({ isOpen: false, staffId: "", staffName: "" });
      // Force refresh the user list after rejection
      await forceRefresh();
    } catch (error: any) {
      console.error("Failed to reject staff:", error);
    }
  };

  // Cancel staff rejection
  const cancelStaffRejection = () => {
    setRejectDialog({ isOpen: false, staffId: "", staffName: "" });
  };

  // Handle image zoom modal
  const openImageZoom = (imageSrc: string, userName: string) => {
    setImageZoomModal({
      isOpen: true,
      imageSrc,
      userName,
    });
  };

  const closeImageZoom = () => {
    setImageZoomModal({
      isOpen: false,
      imageSrc: "",
      userName: "",
    });
  };

  // Handle profile modal
  const openProfileModal = (user: any) => {
    setProfileModal({
      isOpen: true,
      user,
    });
  };

  const closeProfileModal = () => {
    setProfileModal({
      isOpen: false,
      user: null,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 animate-spin text-navy" />
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all platform users and experts
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <UserStatsGrid stats={stats} onBoxClick={handleStatBoxClick} />

      {/* Filters */}
      <UserFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* User Grid */}
      <UserGrid
        users={displayUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onUserClick={openProfileModal}
      />

      {/* Rejection Dialog */}
      <UserRejectionDialog
        isOpen={rejectDialog.isOpen}
        staffName={rejectDialog.staffName}
        onConfirm={confirmStaffRejection}
        onCancel={cancelStaffRejection}
      />

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={profileModal.isOpen}
        user={profileModal.user}
        onClose={closeProfileModal}
        onImageZoom={openImageZoom}
        onApprove={handleStaffApproval}
        onReject={handleStaffRejection}
      />

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={imageZoomModal.isOpen}
        onClose={closeImageZoom}
        imageSrc={imageZoomModal.imageSrc}
        imageAlt={`${imageZoomModal.userName}'s profile picture`}
        userName={imageZoomModal.userName}
      />
    </div>
  );
}
