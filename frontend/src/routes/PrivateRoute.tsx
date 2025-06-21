// src/routes/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // En attendant que AuthContext charge le user (si jamais on veut gérer un loader)
  if (user === null) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
