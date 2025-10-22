// src/pages/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.emailVerified) {
      // If user is already verified, redirect to home
      navigate("/home");
    }
  }, [user, navigate]);

  const handleResend = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
        setMessage("Verification email resent! Please check your inbox.");
      } else {
        setMessage("You must be logged in to resend verification.");
      }
    } catch (err) {
      setMessage(err.message || "Error sending verification email.");
    }
  };

  const handleCheckStatus = async () => {
    await user.reload(); // refresh user data
    if (user.emailVerified) {
      navigate("/home");
    } else {
      setMessage("Email not verified yet. Please check your inbox.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
      <p className="text-gray-700 max-w-md mb-4">
        A verification link has been sent to your email. Please verify your
        address before continuing.
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleResend}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-400"
        >
          Resend Email
        </button>
        <button
          onClick={handleCheckStatus}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400"
        >
          I Verified My Email
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
