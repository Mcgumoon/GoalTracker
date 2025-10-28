import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children, requireVerification = true }) {
    const { user, loading } = useAuth();

    if(loading) {
        return <Spinner label="Loading..." />;
    }
    if(!user) {
        return <Navigate to="/login" replace />;
    }
    if(requireVerification && user && !user.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    if(!requireVerification && user?.emailVerified) {
        return <Navigate to="/home" replace />;
    }
    return children;
}