"use client";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebase } from "./firebase";

export type AdminState =
  | { status: "loading"; user: null; isAdmin: false }
  | { status: "unauthenticated"; user: null; isAdmin: false }
  | { status: "authenticated"; user: User; isAdmin: boolean };

export function useEsAdmin() {
  const { auth, db, provider, isConfigured } = useMemo(() => getFirebase(), []);
  const [state, setState] = useState<AdminState>({ status: "loading", user: null, isAdmin: false });

  useEffect(() => {
    if (!isConfigured || !auth) {
      setState({ status: "unauthenticated", user: null, isAdmin: false });
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !db) {
        setState({ status: "unauthenticated", user: null, isAdmin: false });
        return;
      }
      try {
        const ref = doc(db, "admins", user.uid);
        const snap = await getDoc(ref);
        const isAdmin = !!(snap.exists() && snap.data()?.isAdmin);
        setState({ status: "authenticated", user, isAdmin });
      } catch {
        setState({ status: "authenticated", user, isAdmin: false });
      }
    });

    return () => unsub();
  }, [auth, db, isConfigured]);

  const loginConGoogle = async () => {
    if (!auth || !provider) return;
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return { ...state, loginConGoogle, logout };
}