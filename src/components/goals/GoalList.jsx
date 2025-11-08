import { useState } from "react";
import GoalForm from "./GoalForm";

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

export default function GoalList({ goals, onEdit, onRemove, onToggle, stats }) {
    const points = stats?.points ?? 0;
    const badges = stats?.badges_count ?? 0;

    return (
        <div className="">
            <div className="">
                <h3 className="">Your Goals</h3>
                
                {goals.length === 0 ? (
                    <p className="">No goals yet. Click “New Goal”.</p>
                ) : (
                    <ul className="">
                        {goals.map((g) => (
                            <GoalItem
                                key={g.id}
                                goal={g}
                                onEdit={onEdit}
                                onRemove={onRemove}
                                onToggle={onToggle}
                                stats={{points, badges}}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function GoalItem({ goal, onEdit, onRemove, onToggle }) {
    const [editing, setEditing] = useState(false);
    const [pendingToggle, setPendingToggle] = useState(false);
    const prettyDate = toPrettyDate(goal.dueDate);

    return (
        <li className="">
            <div className="">
                <div className="">
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
                        className=""
                    />
                    <div>
                        <div className="">
                            {goal.completed ? (
                                <span className="">{goal.title}</span>
                            ) : (
                                goal.title
                            )}
                        </div>
                        {goal.notes && (
                            <div className="">
                                {goal.notes}
                            </div>
                        )}
                        {prettyDate && (
                            <div className="">
                                <span className="">Due:</span> {prettyDate}
                            </div>
                        )}
                    </div>
                </div>

                <div className="">
                    <button
                        type="button"
                        className=""
                        onClick={() => setEditing(true)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className=""
                        onClick={() => onRemove(goal.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {editing && (
                <div className="">
                    <GoalForm
                        initial={{
                            title: goal.title ?? "",
                            notes: goal.notes ?? "",
                            dueDate: toInputDate(goal.dueDate),
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
