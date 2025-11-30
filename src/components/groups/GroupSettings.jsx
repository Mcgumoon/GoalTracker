import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import useGroups from "../../hooks/useGroups";

export default function GroupSettings() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { updateGroupName, transferAdmin, removeMember, leaveGroup } =
    useGroups();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const base = useMemo(
    () => ({
      groupDoc: doc(db, "groups", groupId),
      membersCol: collection(db, "groups", groupId, "members"),
    }),
    [groupId]
  );

  useEffect(() => {
    const unsubGroup = onSnapshot(base.groupDoc, (snap) => {
      if (snap.exists()) {
        const g = { id: snap.id, ...snap.data() };
        setGroup(g);
        setGroupName(g.name || "");
      }
    });

    const unsubMembers = onSnapshot(base.membersCol, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ uid: d.id, ...d.data() }));
      arr.sort((a, b) =>
        (a.displayName || "").localeCompare(b.displayName || "")
      );
      setMembers(arr);
    });

    return () => {
      unsubGroup();
      unsubMembers();
    };
  }, [base]);

  if (!group) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <p className="subtle">Loading group settings…</p>
      </section>
    );
  }

  const isAdmin = user?.uid === group.adminUid;

  if (!isAdmin) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <p className="subtle mb-3">
          Only the admin can access group settings.
        </p>
        <Link
          to={`/groups/${group.id}`}
          className="text-sm font-semibold text-violet hover:text-violet2"
        >
          ← Back to group
        </Link>
      </section>
    );
  }

  const saveName = async () => {
    setError("");
    try {
      await updateGroupName(group.id, groupName);
    } catch (err) {
      setError(err?.message || "Unable to save name.");
    }
  };

  const handleTransferAdmin = async (uid) => {
    setError("");
    try {
      await transferAdmin(group.id, uid);
    } catch (err) {
      setError(err?.message || "Unable to transfer admin.");
    }
  };

  const handleRemoveMember = async (uid) => {
    setError("");
    try {
      await removeMember(group.id, uid);
    } catch (err) {
      setError(err?.message || "Unable to remove member.");
    }
  };

  const handleLeave = async () => {
    setError("");
    try {
      await leaveGroup(group.id);
      navigate("/groups");
    } catch (err) {
      setError(err?.message || "Unable to leave group.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-violet">
          {group.name} — Settings
        </h1>
        <Link
          to={`/groups/${group.id}`}
          className="text-sm font-semibold text-violet hover:text-violet2"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Group name */}
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Group Name</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Study Session"
          />
          <button onClick={saveName} className="btn btn-gradient text-sm">
            Save
          </button>
        </div>
      </section>

      {/* Manage members */}
      <section className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Members
          </h2>
          <p className="text-sm text-gray-600">
            You must transfer admin before leaving the group.
          </p>
        </div>

        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.uid}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white/80 px-3 py-2"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {m.displayName || m.uid}
                </div>
                <div className="text-xs text-gray-600">
                  Role: {m.uid === group.adminUid ? "Admin" : "Member"} ·{" "}
                  {m.points || 0} pts
                </div>
              </div>

              {m.uid !== user.uid ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTransferAdmin(m.uid)}
                    className="btn btn-ghost px-3 py-1 text-xs"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => handleRemoveMember(m.uid)}
                    className="btn btn-ghost px-3 py-1 text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-xs font-medium text-muted">
                  (You - Admin)
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Leave group */}
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Leave Group</h2>
        <p className="text-sm text-gray-600">
          You must transfer admin to another member first.
        </p>

        <button
          onClick={handleLeave}
          className="btn text-sm bg-red-500 hover:bg-red-400 text-white"
        >
          Leave group
        </button>
      </section>
    </section>
  );
}
