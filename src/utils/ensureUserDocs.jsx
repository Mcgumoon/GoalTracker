import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


export async function ensureUserDoc(uid) {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { 
      points: 0,
      badges_count: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return;
  }

  const data = snap.data() || {};
  const patch = {};
  if(typeof data.points !== "number") patch.points = 0;
  if(typeof data.badges_count !== "number") patch.badges_count = 0;

  if(Object.keys(patch).length){
    patch.updatedAt = serverTimestamp();
    await setDoc(ref, patch, {merge: true});
  }
}
