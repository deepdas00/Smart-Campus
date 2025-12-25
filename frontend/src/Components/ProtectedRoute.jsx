import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allow  }) {
  const { user, loading } = useAuth();
  

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Role check
  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/" replace />; // or /unauthorized
  }

  return children;
}
