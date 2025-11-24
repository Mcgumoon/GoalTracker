import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();

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
            return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
        }
        if (email && typeof email === "string") return email[0]?.toUpperCase() || "U";
        return "U";
    }, [user?.displayName, email]);

    return (
        <section className="max-w-2xl mx-auto p-6 pt-20 text-center">
            {/* Header / Avatar */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <div
                    className="inline-flex items-center justify-center select-none rounded-2xl text-white font-extrabold tracking-wide bg-gradient-to-br from-rose2 via-rose3 to-violet shadow-pastel ring-2 ring-rose3/60 ring-offset-2 ring-offset-white"
                    style={{ width: 64, height: 64, fontSize: 24, lineHeight: 1 }}
                    aria-label={`Avatar: ${initials}`}
                >
                    <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">{initials}</span>
                </div>

                <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 m-0">{name}</h2>
                    <div className="text-sm text-gray-600">{email}</div>
                    <div className="mt-1">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                          ${verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                            {verified ? "Email Verified" : "Email Not Verified"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Custom divider with your color scheme */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-rose2/50 to-transparent"></div>

            {/* Details Card */}
            <div className="bg-white border-2 border-rose1/40 rounded-2xl p-5 shadow-pastel">
                <div className="flex items-center justify-between py-3 border-b border-dashed border-rose2/60 last:border-b-0">
                    <span className="text-gray-600 mr-4">Name</span>
                    <span className="text-gray-800 font-medium">{name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dashed border-rose2/60 last:border-b-0">
                    <span className="text-gray-600 mr-4">Email</span>
                    <span className="text-gray-800 font-medium">{email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dashed border-rose2/60 last:border-b-0">
                    <span className="text-gray-600 mr-4">Member Since</span>
                    <span className="text-gray-800 font-medium">{created}</span>
                </div>
                <div className="flex items-center justify-between py-3 last:border-b-0">
                    <span className="text-gray-600 mr-4">Email Verified</span>
                    <span className="text-gray-800 font-medium">{verified ? "Yes" : "No"}</span>
                </div>

                <div className="flex justify-center mt-6 gap-3">
                    <Link 
                        to="/change-password" 
                        className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2 transition-transform duration-150 ease-in-out active:translate-y-[1px] select-none bg-violet text-white hover:bg-violet2 shadow-pastel"
                    >
                        Change Password
                    </Link>
                </div>
            </div>
        </section>
    );
}