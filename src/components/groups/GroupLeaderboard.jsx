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
      <section className="">
        <p className="">Loading leaderboard…</p>
      </section>
    );
  }

  return (
    <section className="">
      <div className="">
        <div>
          <h1 className="">
            {group.name} – Leaderboard
          </h1>
          <p className="">
            Points are earned by completing shared group goals.
          </p>
        </div>
        <Link
          to={`/groups/${group.id}`}
          className=""
        >
          Back to group
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="">No members yet.</p>
      ) : (
        <ol className="">
          {members.map((m, idx) => (
            <li
              key={m.uid}
              className=""
            >
              <div className="">
                <span className="">
                  {idx === 0 && "🥇"}
                  {idx === 1 && "🥈"}
                  {idx === 2 && "🥉"}
                  {idx > 2 && idx + 1}
                </span>
                <span className="">
                  {m.displayName || m.uid}
                </span>
              </div>
              <span className="">
                {m.points || 0} pts
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
