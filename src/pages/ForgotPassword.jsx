import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            setLoading(true);
            await resetPassword(email);
            setMessage("Reset Email sent! Check your inbox for further instructions");
        } catch (err) {
            setError("Failed to reset password. " + err.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>
                Forgot Password
            </h1>
            <form onClick={handleSubmit} className="">
                <input type="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email."
                    className="border rounded-md" required />
                <button type="submit" disabled={loading}
                className="">
                    {loading ? "Sending..." : "Reset Password"}
                </button>
            </form>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
}