import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";

export default function Settings() {
    const { user } = useAuth();

    // ---- Derived values ----
    const created = useMemo(() => {
        const t = user?.metadata?.creationTime || user?.metadata?.createdAt;
        return t ? new Date(t).toLocaleDateString() : "-";
    }, [user]);

    const name = user?.displayName?.trim() || "(not set)";
    const email = user?.email || "-";
    const verified = !!user?.emailVerified;

    const initials = useMemo(() => {
        if (user?.displayName) {
            const parts = user.displayName.trim().split(/\s+/);
            return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`;
        }
        return email?.[0]?.toUpperCase() || "U";
    }, [user?.displayName, email]);

    // ---- Delete account handler ----
    const handleDeleteAccount = async () => {
        if (!user) return;

        const confirmed = window.confirm(
            "Are you sure? You will be logged out and unable to access your account again."
        );
        if (!confirmed) return;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                disabled: true,
                disabledAt: new Date(),
            });

            await signOut(auth);
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again.");
        }
    };

    // ---- JSX ----
    return (
        <section className="max-w-2xl mx-auto p-6 pt-20 text-center">

            {/* Avatar + Header */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <div
                    className="inline-flex items-center justify-center select-none rounded-2xl text-white font-extrabold tracking-wide bg-gradient-to-br from-rose2 via-rose3 to-violet shadow-pastel ring-2 ring-rose3/60 ring-offset-2 ring-offset-white"
                    style={{ width: 64, height: 64, fontSize: 24 }}
                >
                    <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">
                        {initials}
                    </span>
                </div>

                <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">{name}</h2>
                    <div className="text-sm text-gray-600">{email}</div>

                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1
                        ${verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                        {verified ? "Email Verified" : "Email Not Verified"}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-rose2/50 to-transparent" />

            {/* Info Card */}
            <div className="bg-white border-2 border-rose1/40 rounded-2xl p-5 shadow-pastel">
                {[
                    ["Name", name],
                    ["Email", email],
                    ["Member Since", created],
                    ["Email Verified", verified ? "Yes" : "No"],
                ].map(([label, value], i) => (
                    <div
                        key={label}
                        className={`flex items-center justify-between py-3 ${
                            i < 3 ? "border-b border-dashed border-rose2/60" : ""
                        }`}
                    >
                        <span className="text-gray-600">{label}</span>
                        <span className="text-gray-800 font-medium">{value}</span>
                    </div>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-center mt-6 gap-3">
                    <Link
                        to="/change-password"
                        className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2 bg-violet text-white hover:bg-violet2 transition-transform active:translate-y-px shadow-pastel"
                    >
                        Change Password
                    </Link>

                    <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-transform active:translate-y-px shadow-md"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </section>
    );
}
