import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface SignupData {
  username: string;
  email: string;
  phone: string;
  bio: string;
  linkedinUrl: string;
  websiteUrl?: string;
  otherUrls?: string[];
  password: string;
  userType: "student" | "expert";
  expertiseAreas?: string[];
  hourlyRate?: string;
  profileImage?: File;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userRole: "admin" | "expert" | "student" | null;
  signup: (data: SignupData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<
    "admin" | "expert" | "student" | null
  >(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("sessionly_token");
    const savedRole = localStorage.getItem("sessionly_role");
    if (token && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole as "admin" | "expert" | "student");
    }
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, using hardcoded credentials
    if (email === "admin@gmail.com" && password === "admin") {
      setIsAuthenticated(true);
      setUserRole("admin");
      localStorage.setItem("sessionly_token", "demo_token");
      localStorage.setItem("sessionly_role", "admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("sessionly_token");
    localStorage.removeItem("sessionly_role");
    navigate("/login");
  };

  const signup = async (data: SignupData) => {
    try {
      // For demo purposes, simulate API call
      console.log("Signup data:", data);

      // In a real app, you would make an API call here
      // For now, we'll simulate a successful signup
      setIsAuthenticated(true);
      setUserRole(data.userType);
      localStorage.setItem("sessionly_token", "demo_token");
      localStorage.setItem("sessionly_role", data.userType);

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userRole, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
