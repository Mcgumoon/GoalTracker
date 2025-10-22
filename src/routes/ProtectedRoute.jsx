import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if(loading) {
        return <Spinner label="Loading..." />;
    }
    if(!user) {
        return <Navigate to="/login" replace />;
    }
    if(user && !user.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    return children;
}