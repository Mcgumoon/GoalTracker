import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoHero from "../components/LogoHero";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      setLoading(true);
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err?.message ? `Failed to reset password. ${err.message}` : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-auth">
      <LogoHero size={96} />
      <h1 className="text-3xl md:text-4xl font-extrabold mt-4">Forgot Password</h1>
      <p className="subtle mb-6">Enter your email to receive a reset link.</p>

      <div className="auth-card">
        {error && (
          <div className="rounded-xl border-2 border-rose3/40 bg-rose2/40 text-[#7a0031] text-sm px-3 py-2 mb-3">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border-2 border-green-200 bg-green-100 text-green-800 text-sm px-3 py-2 mb-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="subtle block mb-1">Email</label>
            <input
              type="email"
              className="input"
              placeholder="example@site.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              Back
            </button>
            <Link to="/login" className="btn btn-ghost">
              Go to Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
