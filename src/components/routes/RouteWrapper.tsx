import { ReactNode } from "react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { Layout } from "../layout/Layout";
import { UserRole } from "../../types/routes";

interface RouteWrapperProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiresLayout?: boolean;
  title?: string;
}

export function RouteWrapper({
  children,
  allowedRoles,
  requiresLayout = true,
  title,
}: RouteWrapperProps) {
  const content = requiresLayout ? (
    <Layout>
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
      {children}
    </Layout>
  ) : (
    children
  );

  if (allowedRoles) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>{content}</ProtectedRoute>
    );
  }

  return <>{content}</>;
}
