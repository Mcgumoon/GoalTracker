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
import { auth } from "../firebase"; 

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

  
  const register = async ({ email, password, username }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (username) await updateProfile(cred.user, { displayName: username });
    await sendEmailVerification(cred.user);
    return cred.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
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