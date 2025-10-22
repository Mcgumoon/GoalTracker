import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
                await register({ email, password: password, displayName });
                setError("Verification email sent! Please check your inbox before logging in.");
                navigate("/verify-email");
            } else {
                await login(email, password);
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
        <div className="">
            <h1 className="text-2xl font-semibold">
                {isRegister ? "Create your account" : "Welcome Back!"}
            </h1>
            <p className="text-sm">
                {isRegister ? "Sign up to get started!" : "Log back to your account!"}
            </p>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-300 text-sm ">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="">
                <ul>
                    {isRegister && (
                        <li>
                            <label className="">Display Name</label>
                            <input type="text" value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Full Name"
                                className=""
                                required
                            />
                        </li>
                    )}
                    <li>
                        <label className="">Email</label>
                        <input type="email" autoComplete="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@example.com"
                            className=""
                        />
                    </li>
                    <li>
                        <label className="">Password</label>
                        <input type="password" autoComplete={isRegister ? "new-password" : "current-password"}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password" className=""
                            required
                            minLength={8}
                        />
                    </li>

                    {isRegister && (
                        <li>
                            <label className="">Confirm Password</label>
                            <input type="password" value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className=""
                                required
                                minLength={8}
                            />
                        </li>
                    )}

                    <button type="submit" disabled={submitting} className="">
                        {submitting ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
                    </button>
                </ul>
            </form>

            <p className="text-sm">
                <Link to="/forgotpassword" className="text-purple-600 hover:underline">Forgot your password?</Link>
            </p>

            <div className="flex items-center">
                <div className="h-px flex-1 bg-gray-200" />
                <h6 className="text-xl">or</h6>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button onClick={handleGoogleSignIn} disabled={submitting}
                className="">
                Continue with Google
            </button>
        </div>
    )
}