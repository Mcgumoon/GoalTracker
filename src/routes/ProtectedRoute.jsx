// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner"; // or simple fallback

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />; // or null

  // not logged in → go to login
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // logged in but not verified → allow only verify page
  if (!user.emailVerified && location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}
