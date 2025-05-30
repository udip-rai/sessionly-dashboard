import { create } from "zustand";
import { User, UserFilters, UserStats } from "../types/users";
import { adminService, Student, Staff } from "../api/services/admin.service";
import { handleJwtExpiration } from "../utils/toast";

// Transform API data to unified User interface
const transformStudentToUser = (student: Student): User => {
  console.log("🔄 Transforming student:", student);
  return {
    id: student._id,
    name: student.username || student.email.split("@")[0],
    email: student.email,
    phone: student.phone || "",
    type: "student",
    status: student.isActive === false ? "blocked" : "active",
    joinedDate: student.createdAt || "",
    timezone: student.timezone || "",
    profilePicture: student.image || "",
    bio: student.bio || "",
    linkedinUrl: student.linkedinUrl || "",
    websiteUrl: student.websiteUrl || "",
    otherUrls: student.otherUrls || [],
  };
};

const transformStaffToUser = (staff: Staff): User => {
  console.log("🔄 Transforming staff:", staff);
  return {
    id: staff._id,
    name: staff.username || staff.email.split("@")[0],
    email: staff.email,
    phone: staff.phone || "",
    type: "staff",
    status:
      staff.isActive === false
        ? "blocked"
        : staff.isApproved
        ? "active"
        : "inactive",
    joinedDate: staff.createdAt || "",
    timezone: staff.timezone || "",
    expertiseAreas: staff.expertiseAreas?.length
      ? [
          `${staff.expertiseAreas.length} area${
            staff.expertiseAreas.length !== 1 ? "s" : ""
          }`,
        ]
      : ["No expertise areas"],
    profilePicture: staff.image || "",
    bio: staff.bio || "",
    linkedinUrl: staff.linkedinUrl || "",
    websiteUrl: staff.websiteUrl || "",
    otherUrls: staff.otherUrls || [],
    rate: staff.rate || "",
    isApproved: staff.isApproved,
  };
};

interface UserManagementState {
  students: Student[];
  staff: Staff[];
  users: User[];
  isLoading: boolean;
  studentsLoading: boolean;
  staffLoading: boolean;
  error: string | null;
  studentsError: string | null;
  staffError: string | null;
  filters: UserFilters;
  filteredUsers: User[];
  stats: UserStats;
  setFilters: (filters: UserFilters) => void;
  updateFilter: (key: keyof UserFilters, value: string) => void;
  fetchStudents: () => Promise<void>;
  fetchStaff: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateCombinedUsers: () => void;
  updateUserStatus: (
    userId: string,
    userType: "student" | "staff",
    status: "active" | "blocked",
  ) => Promise<void>;
  approveStaff: (staffId: string) => Promise<void>;
  rejectStaff: (staffId: string) => Promise<void>;
  calculateStats: () => void;
  calculateFilteredUsers: () => void;
  reset: () => void;
  forceRefresh: () => Promise<void>;
}

export const useUserManagementStore = create<UserManagementState>(
  (set, get) => ({
    // Initial state
    students: [],
    staff: [],
    users: [],
    isLoading: false,
    studentsLoading: false,
    staffLoading: false,
    error: null,
    studentsError: null,
    staffError: null,
    filters: {
      type: "all",
      status: "all",
      searchTerm: "",
    },
    filteredUsers: [],
    stats: {
      totalUsers: 0,
      totalStudents: 0,
      activeStaff: 0,
      pendingApprovals: 0,
    },

    // Filter actions
    setFilters: (filters) => {
      set({ filters });
      get().calculateFilteredUsers();
    },

    updateFilter: (key, value) => {
      const currentFilters = get().filters;
      const newFilters = { ...currentFilters, [key]: value };
      set({ filters: newFilters });
      get().calculateFilteredUsers();
    },

    // Helper function to update combined users array
    updateCombinedUsers: () => {
      const { students, staff } = get();
      const studentUsers = students.map(transformStudentToUser);
      const staffUsers = staff.map(transformStaffToUser);
      const allUsers = [...studentUsers, ...staffUsers];

      console.log("🔄 Updating combined users:", {
        students: students.length,
        staff: staff.length,
        total: allUsers.length,
      });

      set({ users: allUsers });
      get().calculateStats();
      get().calculateFilteredUsers();
    },

    // Data fetching
    fetchStudents: async () => {
      set({ studentsLoading: true, studentsError: null });

      try {
        console.log("🔄 Fetching students from API...");
        const response = await adminService.getAllStudents(1, 100);
        console.log("✅ Students API response:", response);

        const students = response.data || [];
        console.log("📝 Students data:", students);

        set({ students, studentsLoading: false });
        get().updateCombinedUsers();
      } catch (error: any) {
        console.error("❌ Error fetching students:", error);

        const isJwtError = handleJwtExpiration(error);
        let errorMessage = "Failed to fetch students";

        if (!isJwtError) {
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "Session expired. Please log in again.";
        }

        set({ studentsError: errorMessage, studentsLoading: false });
      }
    },

    fetchStaff: async () => {
      set({ staffLoading: true, staffError: null });

      try {
        console.log("🔄 Fetching staff from API...");
        const response = await adminService.getAllStaff(1, 100);
        console.log("✅ Staff API response:", response);

        const staff = response.data || [];
        console.log("📝 Staff data:", staff);

        set({ staff, staffLoading: false });
        get().updateCombinedUsers();
      } catch (error: any) {
        console.error("❌ Error fetching staff:", error);

        const isJwtError = handleJwtExpiration(error);
        let errorMessage = "Failed to fetch staff";

        if (!isJwtError) {
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "Session expired. Please log in again.";
        }

        set({ staffError: errorMessage, staffLoading: false });
      }
    },

    fetchAllUsers: async () => {
      set({ isLoading: true, error: null });

      try {
        await Promise.all([get().fetchStudents(), get().fetchStaff()]);
      } catch (error: any) {
        console.error("❌ Error fetching all users:", error);

        const isJwtError = handleJwtExpiration(error);
        let errorMessage = "Failed to fetch users";

        if (!isJwtError) {
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "Session expired. Please log in again.";
        }

        set({ error: errorMessage });
      } finally {
        set({ isLoading: false });
      }
    },

    // User management actions
    updateUserStatus: async (userId, userType, status) => {
      try {
        await adminService.updateUserStatus(userId, userType, status);
        const state = get();

        if (userType === "student") {
          const updatedStudents = state.students.map((student) =>
            student._id === userId
              ? { ...student, isActive: status === "active" }
              : student,
          );
          set({ students: updatedStudents });
        } else {
          const updatedStaff = state.staff.map((staff) =>
            staff._id === userId
              ? { ...staff, isActive: status === "active" }
              : staff,
          );
          set({ staff: updatedStaff });
        }

        get().updateCombinedUsers();
      } catch (error: any) {
        console.error("Error updating user status:", error);
        handleJwtExpiration(error);
        throw error;
      }
    },

    approveStaff: async (staffId) => {
      try {
        await adminService.approveStaff(staffId);
        const state = get();
        const updatedStaff = state.staff.map((staff) =>
          staff._id === staffId ? { ...staff, isApproved: true } : staff,
        );
        set({ staff: updatedStaff });
        get().updateCombinedUsers();
      } catch (error: any) {
        console.error("Error approving staff:", error);
        handleJwtExpiration(error);
        throw error;
      }
    },

    rejectStaff: async (staffId) => {
      try {
        await adminService.rejectStaff(staffId);
        const state = get();
        const updatedStaff = state.staff.map((staff) =>
          staff._id === staffId ? { ...staff, isActive: false } : staff,
        );
        set({ staff: updatedStaff });
        get().updateCombinedUsers();
      } catch (error: any) {
        console.error("Error rejecting staff:", error);
        handleJwtExpiration(error);
        throw error;
      }
    },

    // Calculations
    calculateStats: () => {
      const users = get().users;
      const stats: UserStats = {
        totalUsers: users.length,
        totalStudents: users.filter((u) => u.type === "student").length,
        activeStaff: users.filter(
          (u) => u.type === "staff" && u.status === "active",
        ).length,
        pendingApprovals: users.filter(
          (u) => u.type === "staff" && !u.isApproved && u.status !== "blocked",
        ).length,
      };
      set({ stats });
    },

    calculateFilteredUsers: () => {
      const { users, filters } = get();
      const searchLower = filters.searchTerm.toLowerCase();

      const filtered = users.filter((user) => {
        if (filters.type !== "all" && user.type !== filters.type) return false;
        if (filters.status !== "all" && user.status !== filters.status)
          return false;
        if (filters.searchTerm) {
          return (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.id.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });

      set({ filteredUsers: filtered });
    },

    // Utility actions
    reset: () => {
      set({
        students: [],
        staff: [],
        users: [],
        isLoading: false,
        studentsLoading: false,
        staffLoading: false,
        error: null,
        studentsError: null,
        staffError: null,
        filters: { type: "all", status: "all", searchTerm: "" },
        filteredUsers: [],
        stats: {
          totalUsers: 0,
          totalStudents: 0,
          activeStaff: 0,
          pendingApprovals: 0,
        },
      });
    },

    forceRefresh: async () => {
      // Clear current data and force fresh fetch
      set({
        students: [],
        staff: [],
        users: [],
        filteredUsers: [],
        stats: {
          totalUsers: 0,
          totalStudents: 0,
          activeStaff: 0,
          pendingApprovals: 0,
        },
      });

      await get().fetchAllUsers();
    },
  }),
);
