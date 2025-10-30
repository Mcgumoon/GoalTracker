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
          className="rounded-2xl bg-gradient-to-br from-rose2 to-violet text-white font-extrabold
                     flex items-center justify-center shadow-pastel"
          style={{ width: 64, height: 64, fontSize: 24 }}
        >
          {initials}
        </div>

        <div className="text-left">
          <h2 className="h1 m-0">{name}</h2>
          <div className="subtle">{email}</div>
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

      <div className="divider" />

      {/* Details Card */}
      <div className="card">
        <div className="card-row">
          <span className="card-label">Name</span>
          <span>{name}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Email</span>
          <span>{email}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Member Since</span>
          <span>{created}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Email Verified</span>
          <span>{verified ? "Yes" : "No"}</span>
        </div>

        <div className="flex justify-center mt-4 gap-3">
          <Link to="/change-password" className="btn btn-primary">
            Change Password
          </Link>
        </div>
      </div>
    </section>
  );
}
