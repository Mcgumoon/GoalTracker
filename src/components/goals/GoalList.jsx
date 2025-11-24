import { useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

import GoalForm from "./GoalForm";
import EmptyState from "../EmptyState";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

const toPrettyDate = (d) => {
  if (!d) return "";
  const date = d?.toDate ? d.toDate() : new Date(d);
  if (isNaN(date)) return "";
  return date.toLocaleDateString();
};

const toInputDate = (d) => {
  if (!d) return "";
  const date = d?.toDate ? d.toDate() : new Date(d);
  if (isNaN(date)) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getUpdatedTime = (goal) => {
  if (!goal.updatedAt) return 0;
  if (goal.updatedAt?.toDate) {
    return goal.updatedAt.toDate().getTime();
  }
  if (goal.updatedAt?.seconds) {
    return goal.updatedAt.seconds * 1000;
  }
  return new Date(goal.updatedAt).getTime();
};

export default function GoalList({
  goals,
  mode = "passthrough",
  onEdit,
  onRemove,
  onToggle,
  stats,
  showCompleted = false,
  setShowCompleted,
}) {
  const { user } = useAuth();
  const [autoGoals, setAutoGoals] = useState([]);
  const [autoLoading, setAutoLoading] = useState(mode !== "passthrough");

  const base = useMemo(
    () => (user?.uid ? collection(db, "users", user.uid, "goals") : null),
    [user?.uid]
  );

  useEffect(() => {
    if (mode === "passthrough") return;
    if (!base) return;

    setAutoLoading(true);

    if (mode === "dashboard") {
      const q = query(base, orderBy("updatedAt", "desc"));

      const unsub = onSnapshot(q, (snap) => {
        const out = [];
        snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
        setAutoGoals(out);
        setAutoLoading(false);
      });

      return () => unsub();
    }
    if (mode === "history") {

      const q = query(
        base,
        where("completed", "==", true)
      );

      const unsub = onSnapshot(q, (snap) => {
        const cutoffMs = Date.now() - FORTY_EIGHT_HOURS_MS;
        const out = [];

        snap.forEach((d) => {
          const data = { id: d.id, ...d.data() };
          const updated = getUpdatedTime(data);

          if (updated <= cutoffMs) {
            out.push(data);
          }
        });


        out.sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));
        setAutoGoals(out);
        setAutoLoading(false);
      });

      return () => unsub();
    }
  }, [mode, base]);


  const sourceGoals = mode === "passthrough" ? (goals ?? []) : autoGoals;
  const loading = mode === "passthrough" ? false : autoLoading;

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading goals…</div>;
  }


  const now = Date.now();

  const incompleteGoals = sourceGoals.filter(g => !g.completed);
  const recentCompletedGoals = sourceGoals.filter(g => {
    if (!g.completed) return false;
    const updated = getUpdatedTime(g);
    return (now - updated) <= FORTY_EIGHT_HOURS_MS;
  });


  const incomplete = incompleteGoals.sort((a, b) => {
    const getDueTime = (goal) => {
      if (!goal.dueDate) return Infinity;
      if (goal.dueDate?.toDate) return goal.dueDate.toDate().getTime();
      if (goal.dueDate?.seconds) return goal.dueDate.seconds * 1000;
      return new Date(goal.dueDate).getTime();
    };

    return (getDueTime(a) || Infinity) - (getDueTime(b) || Infinity);
  });


  const completed = recentCompletedGoals.sort((a, b) => {
    return getUpdatedTime(b) - getUpdatedTime(a);
  });
  //// DO NOT REMOVE YET - FOR DEBUGGING PURPOSES ONLY
  console.log('✅ Completed goals:', completed.map(g => ({
    title: g.title,
    hoursAgo: ((Date.now() - getUpdatedTime(g)) / (1000 * 60 * 60)).toFixed(1) + 'hr'
  })));

  return (
    <div className="w-full">

      <Section
        title="Current Goals"
        goals={incomplete}
        onEdit={onEdit}
        onRemove={onRemove}
        onToggle={onToggle}
        completed={false}
      />


      {completed.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              Recently Completed ({completed.length})
            </h3>
            <span className="text-purple-600 text-lg">
              {showCompleted ? "▾" : "▸"}
            </span>
          </button>

          {showCompleted && (
            <Section
              title=""
              goals={completed}
              onEdit={onEdit}
              onRemove={onRemove}
              onToggle={onToggle}
              completed={true}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, goals, onEdit, onRemove, onToggle, completed }) {
  const grouped = goals.reduce((acc, g) => {
    const cat = g.category?.trim() || "Uncategorized";
    (acc[cat] ||= []).push(g);
    return acc;
  }, {});
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  if (goals.length === 0) {
    return (
      <div>
        {title && (
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        )}
        <EmptyState
          title={completed ? "No completed goals yet" : "No current goals yet"}
          subtitle={
            completed
              ? "Once you complete goals, they will appear here."
              : 'Click "New Goal" to create your first goal.'
          }
          size={180}
        />
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <ul className="space-y-4">
        {categories.map((cat) => (
          <div key={cat} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-purple-600">{cat}</div>
              <div className="text-sm text-gray-500">
                {grouped[cat].length} goal{grouped[cat].length !== 1 ? "s" : ""}
              </div>
            </div>

            <ul className="space-y-3">
              {grouped[cat].map((g) => (
                <GoalItem
                  key={g.id}
                  goal={g}
                  onEdit={onEdit}
                  onRemove={onRemove}
                  onToggle={onToggle}
                  completed={completed}
                />
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}

function GoalItem({ goal, onEdit, onRemove, onToggle, completed }) {
  const [editing, setEditing] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);
  const prettyDate = toPrettyDate(goal.dueDate);
  const category = goal.category || "Uncategorized";

  return (
    <li>
      <div
        className={`flex items-start gap-4 rounded-lg border p-4 transition ${goal.completed ? "border-gray-200 bg-gray-50" : "border-pink-100 bg-white"
          }`}
      >

        {!completed && (
          <div className="pt-1">
            <input
              type="checkbox"
              aria-label="Complete goal"
              checked={!!goal.completed}
              disabled={pendingToggle}
              onChange={async () => {
                try {
                  setPendingToggle(true);
                  await onToggle(goal);
                } finally {
                  setPendingToggle(false);
                }
              }}
              className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-300"
            />
          </div>
        )}

        {/* content */}
        <div className={`flex-1 ${completed ? 'ml-0' : ''}`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium ${goal.completed ? "line-through text-gray-500" : "text-gray-800"
                }`}
            >
              {goal.title}
            </span>

            {prettyDate && (
              <span className="text-xs text-gray-500">
                Due: <span className="font-medium text-gray-700">{prettyDate}</span>
              </span>
            )}
          </div>

          {goal.notes && <div className="mt-1 text-sm text-gray-500">{goal.notes}</div>}

          {completed && (
            <div className="mt-1 text-xs text-gray-400">
              Completed: {toPrettyDate(goal.updatedAt)}
            </div>
          )}
        </div>

        {/* actions */}
        {!completed && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm px-3 py-1.5 border border-purple-200 text-purple-700 rounded-md hover:bg-purple-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onRemove(goal.id)}
              className="text-sm px-3 py-1.5 border border-pink-200 text-pink-600 rounded-md hover:bg-pink-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <GoalForm
            initial={{
              title: goal.title ?? "",
              notes: goal.notes ?? "",
              dueDate: toInputDate(goal.dueDate),
              category: category,
            }}
            onSubmit={async (data) => {
              await onEdit(goal.id, data);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}
    </li>
  );
}