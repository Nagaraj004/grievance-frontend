import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  requiredRole: "admin" | "minister";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return (
      <Navigate
        to={`/login?role=${requiredRole}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // Admin can access both admin and minister routes
  if (
    requiredRole === "minister" &&
    (role === "minister" || role === "admin")
  ) {
    return <>{children}</>;
  }

  if (requiredRole === "admin" && role === "admin") {
    return <>{children}</>;
  }

  return <Navigate to={`/login?role=${requiredRole}`} replace />;
};

export default ProtectedRoute;
