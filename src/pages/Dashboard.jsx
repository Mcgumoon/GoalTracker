import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useGoals from "../hooks/useGoals";
import GoalList from "../components/goals/GoalList";
import Modal from "../components/Modal";
import GoalForm from "../components/goals/GoalForm";

export default function Dashboard() {
  const { user } = useAuth();
  const { goals, loading, createGoal, editGoal, removeGoal, toggleComplete } = useGoals();
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(0);

  const [openNew, setOpenNew] = useState(0);

  useEffect(() => {
    if(!user?.uid) return;
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() || {};
      setPoints(Number(data.points || 0));
      setBadges(Number(data.badges_count ?? 0));
    });
    return () => unsub();
  }, [user?.uid]);

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Dashboard</h1>
      <p className="subtle">
        Welcome back,{" "}
        <span className="font-semibold text-violet">
          {user?.displayName || user?.email?.split("@")[0] || "User"}
        </span>
        .
      </p>

      <div className="divider" />
      
      <div className="">
        <span className="">Points:</span>
        <span className="">{points}</span>
        <span>Badges:</span>
        <span>{badges}</span>
      </div>

      <div className="divider"/>

      <button className="" onClick={() => setOpenNew(true)}>New Goal</button>

      {loading ? (
        <p className="">Loading goals...</p>
      ) : (
        <GoalList 
        goals={goals}
        onCreate={createGoal}
        onEdit={editGoal} 
        onRemove={removeGoal}
        onToggle={toggleComplete}
        stats={{points, badges_count: badges}}
        />
      )}

      <Modal open={openNew} title="Create Goal" onClose={() => setOpenNew(false)}>
        <GoalForm onSubmit={async (data) => {
          await createGoal(data);
          setOpenNew(false);
        }}  onCancel={() => setOpenNew(false)} />
      </Modal>
    </section>
  );
}
