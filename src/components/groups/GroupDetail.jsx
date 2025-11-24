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
    const {
        addGroupGoal,
        toggleGroupGoal,
        removeGroupGoal,
        leaveGroup,
    } = useGroups();

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
            out.sort((a, b) =>
                (a.displayName || "").localeCompare(b.displayName || "")
            );
            setMembers(out);
        });

        const qGoals = query(base.goalsCol, orderBy("updatedAt", "desc"));
        const unsubGoals = onSnapshot(qGoals, (snap) => {
            const arr = [];
            snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));

            
            arr.sort((a, b) => {
                
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }

                
                if (!a.completed) {
                    const aDue = a.dueDate ? prettyDateSort(a.dueDate) : Infinity;
                    const bDue = b.dueDate ? prettyDateSort(b.dueDate) : Infinity;
                    return aDue - bDue;
                }

                
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
            <section className="">
                <p className="">Loading group…</p>
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

    return (
        <section className="">
            <div className="">
                <div>
                    <h1 className="">
                        {group.name}
                    </h1>
                    <p className="">
                        Group code: <span className="">{group.code}</span>
                    </p>
                </div>

                <div className="">
                    <Link
                        to="/groups"
                        className=""
                    >
                        ← Back
                    </Link>
                    <Link
                        to={`/groups/${group.id}/leaderboard`}
                        className=""
                    >
                        Leaderboard
                    </Link>
                    {isAdmin ? (
                        <Link
                            to={`/groups/${group.id}/settings`}
                            className=""
                        >
                            Admin settings
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLeave}
                            className=""
                        >
                            Leave group
                        </button>
                    )}
                </div>
            </div>

            <div className="">
                
                <div>
                    <div className="">
                        <h2 className="">
                            Shared goals
                        </h2>
                        <button
                            type="button"
                            onClick={() => setOpenAdd(true)}
                            className=""
                        >
                            Add goal
                        </button>
                    </div>

                    {goals.length === 0 ? (
                        <p className="">
                            No shared goals yet. Add one to get started.
                        </p>
                    ) : (
                        <ul className="">
                            {goals.map((g) => (
                                <li
                                    key={g.id}
                                    className=""
                                >
                                    <input
                                        type="checkbox"
                                        className=""
                                        checked={!!g.completed}
                                        onChange={(e) =>
                                            toggleGroupGoal(group.id, g.id, e.target.checked)
                                        }
                                    />
                                    <div className="">
                                        <div className="">
                                            <div
                                                className={`text-sm font-medium ${g.completed
                                                    ? "line-through text-slate-400"
                                                    : "text-slate-800"
                                                    }`}
                                            >
                                                {g.title}
                                            </div>
                                            {g.dueDate && (
                                                <div className="">
                                                    Due: {prettyDate(g.dueDate)}
                                                </div>
                                            )}
                                        </div>
                                        {g.notes && (
                                            <p className="">
                                                {g.notes}
                                            </p>
                                        )}
                                    </div>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => removeGroupGoal(group.id, g.id)}
                                            className=""
                                        >
                                            Delete
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                
                <aside>
                    <h2 className="">
                        Members
                    </h2>
                    <ul className="">
                        {members.map((m) => (
                            <li
                                key={m.uid}
                                className=""
                            >
                                <span className="">
                                    {m.displayName || m.uid}
                                </span>
                                <span className="">
                                    {m.role}
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            <Modal
                open={openAdd}
                onClose={() => {
                    setOpenAdd(false);
                    setError("");
                }}
                title="Add shared goal"
            >
                {error && (
                    <div className="">
                        {error}
                    </div>
                )}
                <label className="">
                    Title
                </label>
                <input
                    className=""
                    value={newGoal.title}
                    onChange={(e) =>
                        setNewGoal((g) => ({ ...g, title: e.target.value }))
                    }
                />

                <label className="">
                    Notes
                </label>
                <textarea
                    className=""
                    rows={3}
                    value={newGoal.notes}
                    onChange={(e) =>
                        setNewGoal((g) => ({ ...g, notes: e.target.value }))
                    }
                />

                <label className="">
                    Due date
                </label>
                <input
                    type="date"
                    className=""
                    value={newGoal.dueDate}
                    onChange={(e) =>
                        setNewGoal((g) => ({ ...g, dueDate: e.target.value }))
                    }
                />

                <div className="">
                    <button
                        type="button"
                        onClick={() => setOpenAdd(false)}
                        className=""
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAddGoal}
                        className=""
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
