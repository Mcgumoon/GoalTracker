import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import LogoHero from "../components/LogoHero";

export default function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sending, setSend] = useState(false);

  useEffect(() => {
    if(!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.emailVerified) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleResend = async () => {
    if(!user) {
      setMessage("You must be logged in to resend verification.");
      return;
    }

    try {
      if (user) {
        setSend(true);
        await sendEmailVerification(user);
        setMessage("Verification email resent! Please check your inbox.");
      } else {
        setMessage("You must be logged in to resend verification.");
      }
    } catch (err) {
      setMessage(err.message || "Error sending verification email.");
    } finally {
      setSend(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      await user.reload(); 
      if (user.emailVerified) {
      navigate("/home");
    } else {
      setMessage("Email not verified yet. Please check your inbox.");
    }
  } catch (err) {
      setMessage(err?.message || "Could not refresh verification status.");
    }}
  

  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <LogoHero size={100} />
      <h1 className="text-3xl md:text-4xl font-extrabold mt-6 mb-2">Verify your email</h1>
      <p className="subtle text-base">
        We sent a verification link to{" "}
        <span className="font-semibold text-gray-800">{user?.email || "your email"}</span>.
      </p>
      <p className="subtle mb-8">Please verify to access the web app.</p>

      <div className="w-full max-w-md">
        {message && (
          <div className="rounded-xl border-2 border-rose3/40 bg-rose2/40 text-[#7a0031] text-sm px-3 py-2 mb-4">
            {message}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <button onClick={handleResend} disabled={sending} className="btn btn-primary">
          {sending ? "Sending..." : "Resend verification email"}
        </button>
         <button
          onClick={handleCheckStatus}
          className="btn btn-outline"
        >
          I Verified My Email
        </button>
      </div>
    </section>
  );
}