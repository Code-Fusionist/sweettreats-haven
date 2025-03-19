
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true,
  requireAdmin = false
}: AuthGuardProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Still loading - show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }

  // If admin access is required and user is not an admin, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Render the protected content
  return <>{children}</>;
};
