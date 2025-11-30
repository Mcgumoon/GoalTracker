import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import useGroups from "../../hooks/useGroups";
import Modal from "../user/Modal";

export default function GroupDetail() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { addGroupGoal, toggleGroupGoal, removeGroupGoal, leaveGroup } =
    useGroups();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    notes: "",
    dueDate: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const base = useMemo(
    () => ({
      groupDoc: doc(db, "groups", groupId),
      membersCol: collection(db, "groups", groupId, "members"),
      goalsCol: collection(db, "groups", groupId, "goals"),
    }),
    [groupId]
  );

  useEffect(() => {
    const unsubGroup = onSnapshot(base.groupDoc, (snap) => {
      if (snap.exists()) setGroup({ id: snap.id, ...snap.data() });
      else setGroup(null);
    });

    const unsubMembers = onSnapshot(base.membersCol, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ uid: d.id, ...d.data() }));
      // keep alphabetical order in state
      out.sort((a, b) =>
        (a.displayName || "").localeCompare(b.displayName || "")
      );
      setMembers(out);
    });

    const qGoals = query(base.goalsCol, orderBy("updatedAt", "desc"));
    const unsubGoals = onSnapshot(qGoals, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));

      // same sorting logic as before
      arr.sort((a, b) => {
        // Incomplete goals first
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // For incomplete goals: sort by due date (earliest first)
        if (!a.completed) {
          const aDue = a.dueDate ? prettyDateSort(a.dueDate) : Infinity;
          const bDue = b.dueDate ? prettyDateSort(b.dueDate) : Infinity;
          return aDue - bDue;
        }

        // For completed goals: most recently updated first
        return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0);
      });

      setGoals(arr);
    });

    return () => {
      unsubGroup();
      unsubMembers();
      unsubGoals();
    };
  }, [base]);

  if (!group) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <p className="subtle">Loading group…</p>
      </section>
    );
  }

  const isAdmin = group.adminUid === user?.uid;

  const handleAddGoal = async () => {
    setError("");
    try {
      await addGroupGoal(group.id, newGoal);
      setNewGoal({ title: "", notes: "", dueDate: "" });
      setOpenAdd(false);
    } catch (err) {
      setError(err?.message || "Could not add goal.");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(group.id);
      navigate("/groups");
    } catch (err) {
      alert(err?.message || "Could not leave group.");
    }
  };

  // Leaderboard data derived from members (do not mutate members directly)
  const leaderboard = [...members].sort(
    (a, b) => (b.points || 0) - (a.points || 0)
  );

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-violet">
            {group.name}
          </h1>
          <p className="mt-1 text-sm text-gray-700">
            Group code:{" "}
            <span className="inline-flex items-center rounded-full bg-rose2/40 px-2.5 py-0.5 text-xs font-mono font-semibold text-red-500">
              {group.code}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/groups"
            className="text-muted hover:text-violet transition-colors"
          >
            ← Back
          </Link>
          {isAdmin ? (
            <Link
              to={`/groups/${group.id}/settings`}
              className="btn btn-gradient px-4 py-1.5 text-xs md:text-sm"
            >
              Admin settings
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLeave}
              className="text-xs md:text-sm font-medium text-red-500 hover:text-red-600"
            >
              Leave group
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        {/* Shared goals */}
        <div className="card">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Shared goals</h2>
            <button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="btn btn-gradient rounded-full px-4 py-1.5 text-xs md:text-sm"
            >
              Add goal
            </button>
          </div>

          {goals.length === 0 ? (
            <p className="text-sm text-gray-600">
              No shared goals yet. Add one to get started.
            </p>
          ) : (
            <ul className="space-y-3">
              {goals.map((g) => (
                <li
                  key={g.id}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-white/70 px-3 py-3 shadow-sm hover:shadow-md transition"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-violet focus:ring-violet"
                    checked={!!g.completed}
                    onChange={(e) =>
                      toggleGroupGoal(group.id, g.id, e.target.checked)
                    }
                  />
                  {/* Content + Done/Delete on the same line */}
                  <div className="flex-1 flex items-start justify-between gap-3">
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          g.completed
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {g.title}
                      </div>
                      {g.dueDate && (
                        <div className="mt-0.5 text-xs text-gray-500">
                          Due: {prettyDate(g.dueDate)}
                        </div>
                      )}
                      {g.notes && (
                        <p className="mt-1 text-xs text-gray-600">{g.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {g.completed && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-600">
                          Done
                        </span>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => removeGroupGoal(group.id, g.id)}
                          className="font-medium text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Inline leaderboard (replaces Members list) */}
        <aside className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Leaderboard
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-600">No members yet.</p>
          ) : (
            <ol className="space-y-2">
              {leaderboard.map((m, idx) => (
                <li
                  key={m.uid}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/80 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">
                      {idx === 0 && "🥇"}
                      {idx === 1 && "🥈"}
                      {idx === 2 && "🥉"}
                      {idx > 2 && idx + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-gray-900">
                      {m.displayName || m.uid}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-violet whitespace-nowrap">
                    {m.points || 0} pts
                  </span>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      {/* Add shared goal modal */}
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setError("");
        }}
        title="Add shared goal"
      >
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          className="input mb-3"
          value={newGoal.title}
          onChange={(e) =>
            setNewGoal((g) => ({ ...g, title: e.target.value }))
          }
          placeholder="Finish project proposal"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          className="input resize-none mb-3"
          rows={3}
          value={newGoal.notes}
          onChange={(e) =>
            setNewGoal((g) => ({ ...g, notes: e.target.value }))
          }
          placeholder="Add any extra details you want to share with the group."
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due date
        </label>
        <input
          type="date"
          className="input mb-4"
          value={newGoal.dueDate}
          onChange={(e) =>
            setNewGoal((g) => ({ ...g, dueDate: e.target.value }))
          }
        />

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setOpenAdd(false);
              setError("");
            }}
            className="btn btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddGoal}
            className="btn btn-gradient text-sm"
          >
            Add goal
          </button>
        </div>
      </Modal>
    </section>
  );
}

function prettyDate(d) {
  const date =
    d?.toDate?.() ??
    (d?.seconds ? new Date(d.seconds * 1000) : new Date(d));
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function prettyDateSort(d) {
  const date =
    d?.toDate?.() ??
    (d?.seconds ? new Date(d.seconds * 1000) : new Date(d));
  return date?.getTime?.() ?? Infinity;
}
