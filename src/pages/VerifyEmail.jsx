import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import LogoHero from "../components/LogoHero";

export default function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user?.emailVerified) navigate("/", { replace: true });
  }, [user, navigate]);

  const resend = async () => {
    setMsg(""); setErr("");
    try {
      setSending(true);
      await sendEmailVerification(user);
      setMsg("Verification email sent! Please check your inbox.");
    } catch (e) {
      setErr(e?.message || "Could not send verification email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <LogoHero size={100} />
      <h1 className="text-3xl md:text-4xl font-extrabold mt-6 mb-2">Verify your email</h1>
      <p className="subtle text-base">
        We sent a verification link to{" "}
        <span className="font-semibold text-gray-800">{user?.email || "your email"}</span>.
      </p>
      <p className="subtle mb-8">Please verify to access the app.</p>

      <div className="w-full max-w-md">
        {err && (
          <div className="rounded-xl border-2 border-rose3/40 bg-rose2/40 text-[#7a0031] text-sm px-3 py-2 mb-4">
            {err}
          </div>
        )}
        {msg && (
          <div className="rounded-xl border-2 border-green-200 bg-green-100 text-green-800 text-sm px-3 py-2 mb-4">
            {msg}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <button onClick={resend} disabled={sending} className="btn btn-primary">
          {sending ? "Sending..." : "Resend verification email"}
        </button>
        <button onClick={() => navigate("/login")} className="btn btn-outline">
          Back to login
        </button>
      </div>
    </section>
  );
}
