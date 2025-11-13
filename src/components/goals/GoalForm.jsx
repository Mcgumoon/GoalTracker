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
        <form onSubmit={submit} className="">
            {err && (<div className="">{err}</div>)}
            <div>
                <label className="">Category</label>
                <select className="" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Home</option>
                    <option>Groceries</option>
                    <option>Errands</option>
                    <option>Health</option>
                    <option>Beauty</option>
                    <option>Uncategorized</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
                <label className="">Goal</label>
                <input
                    className=""
                    placeholder="i.e. Read 10 pages"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                />
            </div>
            <div>
                <label className="">Notes (optional)</label>
                <textarea
                    className=""
                    placeholder="Context or steps..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div>
                <label className="">Due Date</label>
                <input
                    type="date"
                    className=""
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>

            <div className="">
                <button type="submit" className="" disabled={busy}>{busy ? "Saving..." : "Save Goal"}</button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="" disabled={busy}>Cancel</button>
                )}
            </div>
        </form>
    );
}