import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!user?.email) {
      setError("You must be logged in to change your password.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("New passwords do not match.");
      return;
    }
    if (newPw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);
      // Re-authenticate
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);
      // Update
      await updatePassword(user, newPw);
      setOk("Password updated successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      onSuccess?.();
    } catch (err) {
      setError(err?.message || "Could not update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      {error && (
        <div className="rounded-xl border-2 border-rose3/40 bg-rose2/40 text-[#7a0031] text-sm px-3 py-2">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-xl border-2 border-green-200 bg-green-100 text-green-800 text-sm px-3 py-2">
          {ok}
        </div>
      )}

      <div>
        <label className="subtle block mb-1">Current password</label>
        <input
          type="password"
          className="input"
          placeholder="Current password"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="subtle block mb-1">New password</label>
        <input
          type="password"
          className="input"
          placeholder="New password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          minLength={8}
          required
        />
      </div>

      <div>
        <label className="subtle block mb-1">Confirm new password</label>
        <input
          type="password"
          className="input"
          placeholder="Confirm new password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          minLength={8}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Updating..." : "Update Password"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
