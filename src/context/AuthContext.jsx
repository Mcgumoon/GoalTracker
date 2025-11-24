import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  onIdTokenChanged,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  updatePassword
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { ensureUserDoc } from "../utils/ensureUserDocs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence);
  }, []);


  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);


      if (currentUser) {
        const token = await currentUser.getIdToken(/* forceRefresh */ false);
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const LOGOUT_IF_NO_ACTIVITY = 15 * 60 * 1000; // logout after 15 minutes of no activity
    let timer;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        signOut(auth);
      }, LOGOUT_IF_NO_ACTIVITY);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));

    const onVisible = () => reset();
    document.addEventListener("visibilitychange", onVisible, { passive: true });
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, reset));
      document.removeEventListener("visibilitychange", onVisible);
    };

  }, [user]);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, snap => {
      const data = snap.data();
      if (data?.disabled === true) {
        signOut(auth);
        setUser(null);
      }
    });

    return () => unsub();
  }, [user]);




  const register = async ({ email, password, displayName }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    await ensureUserDoc(cred.user.uid);
    return cred.user;
  };

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDoc(res.user.uid);
    return res.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    await ensureUserDoc(res.user.uid);

    return res.user;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    return true;
  };

  const changePassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error("No authenticated user");
    await updatePassword(auth.currentUser, newPassword);
    return true;
  }

  const logout = () => signOut(auth);

  const value = { user, loading, register, login, logout, signInWithGoogle, resetPassword, changePassword };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
