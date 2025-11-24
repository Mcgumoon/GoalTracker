import { useCallback, useEffect, useMemo, useState } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
    Timestamp,
    increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function makeCode(length = 7) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

export default function useGroups() {
    const { user } = useAuth();
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const groupsCol = useMemo(
        () => (db ? collection(db, "groups") : null),
        []
    );

    // Subscribe to all groups where I'm a member
    useEffect(() => {
        if (!groupsCol || !user?.uid) return;

        setLoading(true);
        const unsub = onSnapshot(
            groupsCol,
            async (snap) => {
                const results = [];
                const checks = [];

                snap.forEach((gDoc) => {
                    const memberRef = doc(db, "groups", gDoc.id, "members", user.uid);
                    checks.push(
                        getDoc(memberRef).then((mSnap) => {
                            if (mSnap.exists()) {
                                results.push({
                                    id: gDoc.id,
                                    ...gDoc.data(),
                                    membership: { uid: user.uid, ...mSnap.data() },
                                });
                            }
                        })
                    );
                });

                await Promise.all(checks);
                setMyGroups(results);
                setLoading(false);
            },
            (err) => {
                console.error("Error loading groups", err);
                setMyGroups([]);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [groupsCol, user?.uid]);

    // Create a group where I'm admin
    const createGroup = useCallback(
        async (name) => {
            if (!groupsCol || !user?.uid) throw new Error("Not authenticated");

            const cleanName = String(name || "My Group").trim();
            const code = makeCode();

            const gRef = await addDoc(groupsCol, {
                name: cleanName,
                code,
                adminUid: user.uid,
                createdAt: serverTimestamp(),
            });

            const mRef = doc(db, "groups", gRef.id, "members", user.uid);
            await setDocSafe(mRef, {
                uid: user.uid,
                displayName:
                    user.displayName ||
                    (user.email ? user.email.split("@")[0] : "Member"),
                role: "admin",
                joinedAt: serverTimestamp(),
                points: 0,
                completedCount: 0,
            });

            return gRef.id;
        },
        [groupsCol, user?.uid, user?.displayName, user?.email]
    );

    // Join by invite code
    const joinGroupByCode = useCallback(
        async (rawCode) => {
            if (!groupsCol || !user?.uid) throw new Error("Not authenticated");
            const code = String(rawCode || "").trim().toUpperCase();
            if (!code) throw new Error("Enter a code.");

            const q = query(groupsCol, where("code", "==", code));
            const snap = await getDocs(q);
            if (snap.empty) throw new Error("Group not found.");

            const gDoc = snap.docs[0];
            const mRef = doc(db, "groups", gDoc.id, "members", user.uid);

            await setDocSafe(mRef, {
                uid: user.uid,
                displayName:
                    user.displayName ||
                    (user.email ? user.email.split("@")[0] : "Member"),
                role: "member",
                joinedAt: serverTimestamp(),
                points: 0,
                completedCount: 0,
            });

            return gDoc.id;
        },
        [groupsCol, user?.uid, user?.displayName, user?.email]
    );

    // Leave group (non-admin)
    const leaveGroup = useCallback(
        async (groupId) => {
            if (!user?.uid) throw new Error("Not authenticated");

            const gRef = doc(db, "groups", groupId);
            const mRef = doc(db, "groups", groupId, "members", user.uid);

            const gSnap = await getDoc(gRef);
            if (!gSnap.exists()) throw new Error("Group not found");
            const g = gSnap.data();

            if (g.adminUid === user.uid) {
                throw new Error(
                    "You are the admin. Transfer admin to someone else before leaving."
                );
            }

            await deleteDoc(mRef);
        },
        [user?.uid]
    );

    // Admin: transfer admin role
    //   const transferAdmin = useCallback(
    //     async (groupId, newAdminUid) => {
    //       if (!user?.uid) throw new Error("Not authenticated");

    //       const gRef = doc(db, "groups", groupId);
    //       const newAdminRef = doc(db, "groups", groupId, "members", newAdminUid);
    //       const oldAdminRef = doc(db, "groups", groupId, "members", user.uid);

    //       const [gSnap, mSnap] = await Promise.all([
    //         getDoc(gRef),
    //         getDoc(newAdminRef),
    //       ]);

    //       if (!gSnap.exists()) throw new Error("Group not found");
    //       const g = gSnap.data();
    //       if (g.adminUid !== user.uid) {
    //         throw new Error("Only the current admin can transfer admin.");
    //       }
    //       if (!mSnap.exists()) {
    //         throw new Error("New admin must be a member.");
    //       }

    //       await updateDoc(gRef, { adminUid: newAdminUid });
    //       await updateDoc(newAdminRef, { role: "admin" });
    //       await updateDoc(oldAdminRef, { role: "member" });
    //     },
    //     [user?.uid]
    //   );
    const transferAdmin = useCallback(
        async (groupId, newAdminUid) => {
            if (!user?.uid) throw new Error("Not authenticated");

            const gRef = doc(db, "groups", groupId);
            const newAdminRef = doc(db, "groups", groupId, "members", newAdminUid);
            const oldAdminRef = doc(db, "groups", groupId, "members", user.uid);

            const [gSnap, newAdminSnap] = await Promise.all([
                getDoc(gRef),
                getDoc(newAdminRef),
            ]);

            if (!gSnap.exists()) throw new Error("Group not found");
            const g = gSnap.data();

            if (g.adminUid !== user.uid)
                throw new Error("Only the current admin can transfer admin.");

            if (!newAdminSnap.exists())
                throw new Error("New admin must be a member.");

            // 🔥 UPDATE BOTH MEMBER DOCS FIRST
            await Promise.all([
                updateDoc(newAdminRef, { role: "admin" }),
                updateDoc(oldAdminRef, { role: "member" }),
            ]);

            // 🔥 THEN update the group
            await updateDoc(gRef, { adminUid: newAdminUid });

            return true;
        },
        [user?.uid]
    );


    // Admin: rename group
    const updateGroupName = useCallback(async (groupId, name) => {
        const gRef = doc(db, "groups", groupId);
        await updateDoc(gRef, { name: String(name || "").trim() });
    }, []);

    // Admin: remove member
    const removeMember = useCallback(
        async (groupId, memberUid) => {
            if (!user?.uid) throw new Error("Not authenticated");
            const gRef = doc(db, "groups", groupId);
            const gSnap = await getDoc(gRef);
            if (!gSnap.exists()) throw new Error("Group not found");
            const g = gSnap.data();
            if (g.adminUid !== user.uid) throw new Error("Only admin can remove members.");
            if (memberUid === user.uid)
                throw new Error("Use the Leave Group button to leave yourself.");

            const mRef = doc(db, "groups", groupId, "members", memberUid);
            await deleteDoc(mRef);
        },
        [user?.uid]
    );

    // Shared group goals
    const addGroupGoal = useCallback(
        async (groupId, { title, notes, dueDate }) => {
            if (!user?.uid) throw new Error("Not authenticated");

            const goalsCol = collection(db, "groups", groupId, "goals");
            await addDoc(goalsCol, {
                title: String(title || "").trim(),
                notes: String(notes || "").trim(),
                dueDate: dueDate
                    ? Timestamp.fromDate(new Date(dueDate + "T00:00:00"))
                    : null,
                completed: false,
                createdBy: user.uid,
                completedBy: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        },
        [user?.uid]
    );

    // Toggle completion and adjust points
    const toggleGroupGoal = useCallback(
        async (groupId, goalId, willComplete) => {
            if (!user?.uid) throw new Error("Not authenticated");

            const gRef = doc(db, "groups", groupId, "goals", goalId);
            const mRef = doc(db, "groups", groupId, "members", user.uid);

            await updateDoc(gRef, {
                completed: !!willComplete,
                completedBy: willComplete ? user.uid : null,
                updatedAt: serverTimestamp(),
            });

            // Simple points logic: +1 when completing, -1 when un-completing
            const delta = willComplete ? 1 : -1;
            await updateDoc(mRef, {
                points: increment(delta),
                completedCount: increment(delta),
            });
        },
        [user?.uid]
    );

    const removeGroupGoal = useCallback(async (groupId, goalId) => {
        const gRef = doc(db, "groups", groupId, "goals", goalId);
        await deleteDoc(gRef);
    }, []);

    return {
        myGroups,
        loading,
        createGroup,
        joinGroupByCode,
        leaveGroup,
        transferAdmin,
        updateGroupName,
        removeMember,
        addGroupGoal,
        toggleGroupGoal,
        removeGroupGoal,
    };
}

async function setDocSafe(ref, data) {
    try {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(ref, data, { merge: true });
    } catch (err) {
        console.error("setDocSafe error", err);
        throw err;
    }
}
