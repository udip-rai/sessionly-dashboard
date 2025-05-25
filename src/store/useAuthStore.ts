import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  userType: "student" | "staff" | "admin";
  redirectUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

// Token management functions
const setAuthToken = (token: string) => {
  Cookies.set("token", token, { expires: 7, secure: true });
};

const removeAuthToken = () => {
  Cookies.remove("token");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) setAuthToken(token);
        else removeAuthToken();
        set({ token });
      },
      logout: () => {
        removeAuthToken();
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
