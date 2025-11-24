import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthForm({ mode = "login" }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const { login, register, signInWithGoogle } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        await register({ email, password, displayName });
        navigate("/verify-email");
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      setSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-base">
      {error && (
        <div className="rounded-xl border-2 border-rose3/40 bg-rose2/40 text-[#7a0031] text-sm px-3 py-2 text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
        {isRegister && (
          <div>
            <label className="subtle block mb-1">Display Name</label>
            <input
              className="input"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="subtle block mb-1">Email</label>
          <input
            className="input"
            type="email"
            placeholder="example@site.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="subtle block mb-1">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </div>

        {isRegister && (
          <div>
            <label className="subtle block mb-1">Confirm Password</label>
            <input
              className="input"
              type="password"
              placeholder="Re-enter Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          aria-busy={submitting}
        >
          {submitting
            ? "Please wait..."
            : isRegister
            ? "Create Account"
            : "Log In"}
        </button>
      </form>

      <Link to="/forgot-password" className="btn btn-outline text-base font-medium">
        Forgot your password?
      </Link>

      <div className="divider my-4" />
      <div className="text-base text-center font-medium text-gray-700">or</div>
      <div className="divider my-4" />

      <button
        onClick={handleGoogleSignIn}
        disabled={submitting}
        className="btn btn-ghost text-base font-semibold"
      >
        Continue with Google
      </button>

      <div className="text-base font-medium mt-2">
      </div>
    </div>
  );
}
