import { BrowserRouter as Router } from "react-router-dom";
import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { NotificationProvider } from "./NotificationProvider";
import { AuthProvider } from "../../context/AuthContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <Router>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </Router>
    </QueryProvider>
  );
}
