import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import useGroups from "../../hooks/useGroups";

export default function GroupSettings() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { updateGroupName, transferAdmin, removeMember, leaveGroup } = useGroups();

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
      arr.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
      setMembers(arr);
    });

    return () => {
      unsubGroup();
      unsubMembers();
    };
  }, [base]);

  if (!group) {
    return (
      <section className="">
        <p className="">Loading group settings…</p>
      </section>
    );
  }

  const isAdmin = user?.uid === group.adminUid;

  
  if (!isAdmin) {
    return (
      <section className="">
        <p className="">Only the admin can access group settings.</p>
        <Link
          to={`/groups/${group.id}`}
          className=""
        >
          Back to Group
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
    <section className="">
      <div className="">
        <h1 className="">
          {group.name} — Settings
        </h1>
        <Link
          to={`/groups/${group.id}`}
          className=""
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="">
          {error}
        </div>
      )}

      
      <section className="">
        <h2 className="">Group Name</h2>
        <div className="">
          <input
            className=""
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            onClick={saveName}
            className=""
          >
            Save
          </button>
        </div>
      </section>

      
      <section className="">
        <h2 className="">Manage Members</h2>
        <p className="">
          You must transfer admin before leaving the group.
        </p>

        <ul className="">
          {members.map((m) => (
            <li
              key={m.uid}
              className=""
            >
              <div>
                <div className="">{m.displayName || m.uid}</div>
                <div className="">
                  Role: {m.uid === group.adminUid ? "Admin" : "Member"} · {m.points || 0} pts
                </div>
              </div>

              {m.uid !== user.uid ? (
                <div className="">
                  <button
                    onClick={() => handleTransferAdmin(m.uid)}
                    className=""
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => handleRemoveMember(m.uid)}
                    className=""
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="">(You - Admin)</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      
      <section className="">
        <h2 className="">Leave Group</h2>
        <p className="">
          You must transfer admin to another member first.
        </p>

        <button
          onClick={handleLeave}
          className=""
        >
          Leave group
        </button>
      </section>
    </section>
  );
}