import { useCallback, useEffect, useMemo, useState } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function useGoals() {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const base = useMemo(() => {
        if (!user?.uid) return null;
        return {
            goalsCol: collection(db, "users", user.uid, "goals"),
            userDoc: doc(db, "users", user.uid),
        };
    }, [user?.uid]);

    useEffect(() => {
        if (!base) return;
        const q = query(base.goalsCol, orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const out = [];
            snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
            setGoals(out);
            setLoading(false);
        });
        return () => unsub();
    }, [base]);

    // BEFORE:
    // const createGoal = useCallback(async ({ title, notes, dueDate }) => {

    const createGoal = useCallback(
        async ({ title, notes, dueDate, category }) => {
            if (!base) throw new Error("Not authenticated");

            const cleanTitle = String(title || "").trim();
            const cleanNotes = String(notes || "").trim();
            const cleanCategory =
                (category && String(category).trim()) || "Uncategorized";
            const cleanDue =
                dueDate && String(dueDate).trim()
                    ? Timestamp.fromDate(new Date(String(dueDate).trim() + "T00:00:00"))
                    : null;

            await addDoc(base.goalsCol, {
                title: cleanTitle,
                notes: cleanNotes,
                category: cleanCategory,
                dueDate: cleanDue,
                completed: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        },
        [base]
    );

    // BEFORE:
    // const editGoal = useCallback(async (id, { title, notes, dueDate }) => {

    const editGoal = useCallback(
        async (id, { title, notes, dueDate, category }) => {
            if (!base) throw new Error("Not authenticated");

            const patch = { updatedAt: serverTimestamp() };
            if (title !== undefined) patch.title = String(title).trim();
            if (notes !== undefined) patch.notes = String(notes).trim();
            if (category !== undefined) {
                patch.category = (category && String(category).trim()) || "Uncategorized";
            }

            if (dueDate !== undefined) {
                patch.dueDate =
                    dueDate && dueDate.trim()
                        ? Timestamp.fromDate(new Date(dueDate.trim() + "T00:00:00"))
                        : null;
            }

            await updateDoc(doc(base.goalsCol, id), patch);
        },
        [base]
    );

    const removeGoal = useCallback(
        async (id) => {
            if (!base) throw new Error("Not authenticated");

            const goalRef = doc(base.goalsCol, id);
            const userRef = base.userDoc;

            await runTransaction(db, async (tx) => {
                const [gSnap, uSnap] = await Promise.all([tx.get(goalRef), tx.get(userRef)]);
                if (!gSnap.exists()) return;

                const wasCompleted = !!gSnap.data().completed;
                const prevPoints = Number(uSnap.data()?.points || 0);

                tx.delete(goalRef);

                if (wasCompleted) {
                    const nextPoints = Math.max(0, prevPoints - 1);
                    const nextBadges = Math.floor(nextPoints / 5);

                    tx.set(
                        userRef,
                        {
                            points: nextPoints,
                            badges_count: nextBadges,
                            updatedAt: serverTimestamp(),
                        },
                        { merge: true }
                    );
                }
            });
        },
        [base]
    );

    const toggleComplete = useCallback(
        async (goal) => {
            if (!base) throw new Error("Not authenticated");

            const goalRef = doc(base.goalsCol, goal.id);
            const userRef = base.userDoc;

            let earnedBadge = false;
            let earnedBadgeIndex = 0;

            await runTransaction(db, async (tx) => {
                const [gSnap, uSnap] = await Promise.all([tx.get(goalRef), tx.get(userRef)]);
                if (!gSnap.exists()) throw new Error("Goal not found");

                const wasCompleted = !!gSnap.data().completed;
                const willComplete = !wasCompleted;

                tx.update(goalRef, {
                    completed: willComplete,
                    updatedAt: serverTimestamp(),
                });

                const prevPoints = Number(uSnap.data()?.points || 0);

                const delta = willComplete ? 1 : -1;
                const nextPoints = Math.max(0, prevPoints + delta);
                const nextBadges = Math.floor(nextPoints / 5);

                tx.set(
                    userRef,
                    {
                        points: nextPoints,
                        badges_count: nextBadges,
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            });

            return { earnedBadge, badgeIndex: earnedBadgeIndex };
        },
        [base]
    );

    return { goals, loading, createGoal, editGoal, removeGoal, toggleComplete };
}