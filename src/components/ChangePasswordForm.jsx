import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function ChangePasswordForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setmessage] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmessage("");
    setErr("");

    if (!user?.email) {
      setErr("You must be logged in to change your password.");
      return;
    }
    if (newPassword.length < 8) {
      setErr("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNew) {
      setErr("New passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);

      await updatePassword(auth.currentUser, newPassword);

      setmessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNew("");
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (e2) {
      const message =
        e2?.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : e2?.code === "auth/weak-password"
            ? "New password is too weak."
            : e2?.code === "auth/requires-recent-login"
              ? "For security, please log out and log back in, then try again."
              : e2?.message || "Failed to change password.";
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
  }

  return (
    <section className="">
      <h2 className="">Change Password</h2>

      {message && (
        <div className="">
          {message}
        </div>
      )}
      {err && (
        <div className="">
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="">Current password</label>
          <input
            type="password"
            className="border rounded-md"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex flex-col">
          <label className="">New password</label>
          <input
            type="password"
            className="border rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col">
          <label className="">Confirm new password</label>
          <input
            type="password"
            className="border rounded-md"
            value={confirmNew}
            onChange={(e) => setConfirmNew(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-purple-600 text-white"
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>
          <button 
          type="button"
          onClick={handleCancel}
          className="rounded-md bg-purple-800 text-white"
          >
            Cancel 
          </button>
        </div>
      </form>
    </section>
  );
}
