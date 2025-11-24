import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/user/AuthForm";
import { useAuth } from "../context/AuthContext";
import LogoHero from "../components/LogoHero";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.emailVerified) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <section className="page-auth">
      <LogoHero size={96} />
      <h1 className="text-3xl md:text-4xl font-extrabold mt-4">Welcome Back!</h1>
      <p className="subtle mb-6">Log back into your account</p>
      <div className="auth-card">
        <AuthForm mode="login" />
      </div>
      <p className="text-base font-medium mt-4">
        New here?{" "}
        <Link to="/register" className="text-violet hover:text-violet2 font-semibold">
          Create an account
        </Link>
      </p>
    </section>
  );
}
