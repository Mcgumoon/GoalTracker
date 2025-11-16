import { useEffect, useState } from "react";

export default function GoalForm({ initial, onSubmit, onCancel }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [notes, setNotes] = useState(initial?.notes || "");
    const [dueDate, setDueDate] = useState(initial?.dueDate || "");
    const [category, setCategory] = useState(initial?.category || "Uncategorized");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        setTitle(initial?.title || "");
        setNotes(initial?.notes || "");
        setDueDate(initial?.dueDate || "");
        setCategory(initial?.category || "Uncategorized");
    }, [initial]);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        if (!title.trim()) return setErr("Goal is required");
        try {
            setBusy(true);
            await onSubmit({ title: title.trim(), notes: notes.trim(), dueDate: dueDate || "", category: (category || "Uncategorized").trim() });
            if (!initial) { setTitle(""); setNotes(""); setDueDate(""); setCategory(""); }
        } catch (e) {
            setErr(e?.message || "Could not save goal.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} className="w-full">
            {err && (<div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">{err}</div>)}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                <select
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option>Home</option>
                    <option>Groceries</option>
                    <option>Errands</option>
                    <option>Health</option>
                    <option>Beauty</option>
                    <option>Uncategorized</option>
                    <option>Other</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Goal</label>
                <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="i.e. Read 10 pages"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Notes (optional)</label>
                <textarea
                    className="w-full min-h-[86px] rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Context or steps..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Due Date</label>
                <input
                    type="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center gap-3 mt-2">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full btn-gradient px-5 py-2 text-sm font-semibold shadow-md hover:scale-[1.02] transform transition"
                    disabled={busy}
                >
                    {busy ? "Saving..." : "Save Goal"}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-purple-200 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition"
                        disabled={busy}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
