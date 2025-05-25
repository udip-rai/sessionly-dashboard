import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  userType: "student" | "staff" | "admin";
  redirectUrl?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
