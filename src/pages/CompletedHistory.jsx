import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

const toDate = (t) => {
  if (!t) return null;
  if (t?.toDate) return t.toDate();
  if (t?.seconds) return new Date(t.seconds * 1000);
  return new Date(t);
};

const pretty = (d) => (d ? toDate(d).toLocaleDateString() : "");

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

export default function CompletedHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const base = useMemo(
    () => (user?.uid ? collection(db, "users", user.uid, "goals") : null),
    [user?.uid]
  );

  useEffect(() => {
    if (!base) return;

    setLoading(true);
    setError("");

    try {
      const q = query(
        base,
        where("completed", "==", true)
      );

      const unsub = onSnapshot(q, 
        (snap) => {
          const cutoffMs = Date.now() - FORTY_EIGHT_HOURS_MS;
          const list = [];

          snap.forEach((d) => {
            const data = { id: d.id, ...d.data() };
            const updated = getUpdatedTime(data);

            
            if (updated <= cutoffMs) {
              list.push(data);
            }
          });

          
          list.sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));
          
          setItems(list);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore error:", error);
          setError("Failed to load completed goals history");
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error("Query setup error:", err);
      setError("Error setting up query");
      setLoading(false);
    }
  }, [base]);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <div className="p-4 text-sm text-gray-500">Loading history...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto p-6 pt-20">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-violet">
          Completed Goals History
        </h1>
        <div className="divider" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-violet">
        Completed Goals History
      </h1>

      <div className="divider" />

      {items.length === 0 ? (
        <EmptyState
          title="No goals over 48 hours yet"
          subtitle="Goals that were completed more than 48 hours ago will appear here."
          actionLabel="Go to Dashboard"
          onAction={() => navigate("/")}
          size={220}
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(
            items.reduce((acc, g) => {
              const cat = (g.category?.trim() || "Uncategorized").trim();
              (acc[cat] ||= []).push(g);
              return acc;
            }, {})
          )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([cat, list]) => (
              <div key={cat} className="bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-purple-600">{cat}</div>
                  <div className="text-sm text-gray-500">
                    {list.length} goal{list.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <ul className="space-y-3">
                  {list.map((g) => (
                    <li key={g.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800 line-through">
                            {g.title}
                          </span>
                          {g.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due:{" "}
                              <span className="font-medium text-gray-700">
                                {pretty(g.dueDate)}
                              </span>
                            </span>
                          )}
                        </div>
                        {g.notes && (
                          <div className="mt-1 text-sm text-gray-500">{g.notes}</div>
                        )}
                        <div className="mt-1 text-xs text-gray-400">
                          Completed:{" "}
                          <span className="font-medium">
                            {pretty(g.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}