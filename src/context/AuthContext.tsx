import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userRole: "admin" | "expert" | "student" | null;
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole }}>
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
