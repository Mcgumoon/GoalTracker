import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useGoals from "../hooks/useGoals";
import GoalList from "../components/goals/GoalList";
import Modal from "../components/user/Modal";
import GoalForm from "../components/goals/GoalForm";
import EmptyState from "../components/EmptyState";
import BadgeStat from "../components/user/BadgeStat";

export default function Dashboard() {
  const { user } = useAuth();
  const { goals, loading, createGoal, editGoal, removeGoal, toggleComplete } =
    useGoals();
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(0);
  const [openNew, setOpenNew] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
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
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-violet">
          Dashboard
        </h1>
        <p className="subtle">
          Welcome back,{" "}
          <span className="font-semibold text-violet">
            {user?.displayName || user?.email?.split("@")[0] || "User"}
          </span>
          .
        </p>
      </header>

      <div className="divider" />

      {/* Stats row (styled) */}
      <div className="auth-card flex flex-col md:flex-row items-center gap-4 mb-6 p-4 md:p-5 rounded-xl">
        {/* Left: Points */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-3 bg-white border border-purple-100 shadow-sm px-4 py-3 rounded-xl">
            <span className="text-lg font-bold text-purple-600">{points}</span>
            <span className="text-sm text-gray-500">Points</span>
          </div>

          {/* Badges: fire icon + count */}
          <BadgeStat stats={{ badges_count: badges }} />
        </div>

        {/* Right: New Goal button */}
        <div className="flex-shrink-0">
          <button
            className="btn btn-gradient rounded-full px-4 py-2 text-sm"
            onClick={() => setOpenNew(true)}
          >
            New Goal
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* Goals list area */}
      <section>
        {loading ? (
          <p className="subtle">Loading goals...</p>
        ) : goals?.length === 0 ? (
          <EmptyState
            title="No goals yet"
            description="Create your first goal to get started."
            actionLabel="New Goal"
            onAction={() => setOpenNew(true)}
          />
        ) : (
          <div className="space-y-4">
            <GoalList
              goals={goals}
              mode="dashboard"
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              onCreate={createGoal}
              onEdit={editGoal}
              onRemove={removeGoal}
              onToggle={toggleComplete}
              stats={{ points, badges_count: badges }}
            />
          </div>
        )}
      </section>

      <Modal open={openNew} onClose={() => setOpenNew(false)}>
        <GoalForm
          onSubmit={async (data) => {
            await createGoal(data);
            setOpenNew(false);
          }}
          onCancel={() => setOpenNew(false)}
        />
      </Modal>
    </section>
  );
}