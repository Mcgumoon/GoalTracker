import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/user/AuthForm";
import LogoHero from "../components/LogoHero";

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.emailVerified) navigate("/", { replace: true });
    if (!loading && user && !user.emailVerified) navigate("/verify-email", { replace: true });
  }, [user, loading, navigate]);

  return (
    <section className="page-auth">
      <LogoHero size={96} />
      <h1 className="text-3xl md:text-4xl font-extrabold mt-4">Create your account</h1>
      <p className="subtle mb-6">Sign up to get started!</p>
      <div className="auth-card">
        <AuthForm mode="register" />
      </div>
      <p className="text-base font-medium mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-violet hover:text-violet2 font-semibold">
          Log in
        </Link>
      </p>
    </section>
  );
}
