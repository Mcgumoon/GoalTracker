import { useState } from "react";
import GoalForm from "./GoalForm";
import EmptyState from "../EmptyState";

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

export default function GoalList({
  goals,
  onEdit,
  onRemove,
  onToggle,
  stats,
}) {

  const imcompletedGoals = goals.filter((g) => !g.completed);

// 48 hours in ms
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
const now = Date.now();

const completedGoals = goals.filter((g) => {
  if (!g.completed) return false;

  const updated = g.updatedAt?.toDate
    ? g.updatedAt.toDate()
    : new Date(g.updatedAt.seconds * 1000);

  const diffMs = now - updated.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  const keep = diffMs <= FORTY_EIGHT_HOURS;

  // DO NOT REMOVE UNTIL WE HAVE A 48HRS EXAMPLE
  console.log(`Goal "${g.title}" updated ${diffHours}h ago → ${keep ? "KEPT" : "FILTERED OUT"}`);

  return keep;
});

  const incomplete = imcompletedGoals.sort((a, b) => {
    const aDue = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(a.dueDate.seconds * 1000);
    const bDue = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(b.dueDate.seconds * 1000);
    return aDue - bDue;
  });
  const completed = completedGoals.sort((a, b) => {
    const aDue = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(a.dueDate.seconds * 1000);
    const bDue = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(b.dueDate.seconds * 1000);
    return aDue - bDue;
  });

  console.log('completed: ', completed);



  return (
    <div className="w-full">
      {/* CURRENT GOALS */}
      <Section
        title="Current Goals"
        goals={incomplete}
        onEdit={onEdit}
        onRemove={onRemove}
        onToggle={onToggle}
        completed={false}
      />

      {/* COMPLETED GOALS */}
      <div className="mt-10">
        <Section
          title="Completed Goals"
          goals={completed}
          onEdit={onEdit}
          onRemove={onRemove}
          onToggle={onToggle}
          completed={true}
        />
      </div>
    </div>
  );
}

function Section({ title, goals, onEdit, onRemove, onToggle, completed }) {
  // group by category for the given goals
  const grouped = goals.reduce((acc, g) => {
    const cat = g.category?.trim() || "Uncategorized";
    acc[cat] ||= [];
    acc[cat].push(g);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b)
  );

  // Empty state (animated) for this section
  if (goals.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h3>
        <EmptyState
          title={
            completed ? "No completed goals yet" : "No current goals yet"
          }
          subtitle={
            completed
              ? "Once you complete goals, they will appear here."
              : 'Click "New Goal" to create your first goal.'
          }
          size={220}
        />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>

      <ul className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-purple-600">
                {cat}
              </div>
              <div className="text-sm text-gray-500">
                {grouped[cat].length} goal
                {grouped[cat].length !== 1 ? "s" : ""}
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
                />
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}

function GoalItem({ goal, onEdit, onRemove, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);
  const prettyDate = toPrettyDate(goal.dueDate);
  const category = goal.category || "Uncategorized";

  return (
    <li>
      <div
        className={`flex items-start gap-4 rounded-lg border p-4 transition ${goal.completed
            ? "border-gray-200 bg-gray-50"
            : "border-pink-100 bg-white"
          }`}
      >
        {/* checkbox */}
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

        {/* content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium ${goal.completed
                  ? "line-through text-gray-500"
                  : "text-gray-800"
                }`}
            >
              {goal.title}
            </span>

            {prettyDate && (
              <span className="text-xs text-gray-500">
                Due:{" "}
                <span className="font-medium text-gray-700">
                  {prettyDate}
                </span>
              </span>
            )}
          </div>

          {goal.notes && (
            <div className="mt-1 text-sm text-gray-500">
              {goal.notes}
            </div>
          )}
        </div>

        {/* actions */}
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
