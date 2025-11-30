import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function GroupLeaderboard() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  const base = useMemo(
    () => ({
      groupDoc: doc(db, "groups", groupId),
      membersCol: collection(db, "groups", groupId, "members"),
    }),
    [groupId]
  );

  useEffect(() => {
    const unsubGroup = onSnapshot(base.groupDoc, (snap) => {
      if (snap.exists()) setGroup({ id: snap.id, ...snap.data() });
    });

    const unsubMembers = onSnapshot(base.membersCol, (snap) => {
      const out = [];
      snap.forEach((d) => out.push({ uid: d.id, ...d.data() }));
      out.sort((a, b) => (b.points || 0) - (a.points || 0));
      setMembers(out);
    });

    return () => {
      unsubGroup();
      unsubMembers();
    };
  }, [base]);

  if (!group) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <p className="subtle">Loading leaderboard…</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-violet">
            {group.name} – Leaderboard
          </h1>
          <p className="subtle text-gray-700 mt-1">
            Points are earned by completing shared group goals.
          </p>
        </div>
        <Link
          to={`/groups/${group.id}`}
          className="text-sm font-semibold text-violet hover:text-violet2"
        >
          ← Back to group
        </Link>
      </div>

      {/* Leaderboard */}
      {members.length === 0 ? (
        <p className="subtle">No members yet.</p>
      ) : (
        <ol className="card space-y-3">
          {members.map((m, idx) => (
            <li
              key={m.uid}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">
                  {idx === 0 && "🥇"}
                  {idx === 1 && "🥈"}
                  {idx === 2 && "🥉"}
                  {idx > 2 && idx + 1}
                </span>
                <span className="truncate text-sm font-medium text-gray-900">
                  {m.displayName || m.uid}
                </span>
              </div>

              <span className="text-sm font-semibold text-violet whitespace-nowrap">
                {m.points || 0} pts
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
