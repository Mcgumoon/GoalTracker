import { Link, Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function Register(){
    const { user } = useAuth();
    if (user && !user.emailVerified) return <Navigate to="/verify-email" replace />;
    if (user && user.emailVerified) return <Navigate to="/home" replace />;

    return (
        <div>
            <div>
                <h1>Register</h1>
                <p>Already have an account?{" "}
                    <Link to="/login" className="">Log in</Link>
                </p>
            </div>
            <AuthForm mode="register" />
        </div>
    );
}