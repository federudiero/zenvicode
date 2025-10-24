// Firebase client initialization for Next.js App Router (SSR-safe)
// Evita exceptions cuando falta config o si se ejecuta en SSR/Edge.
// No necesita "use client" porque no exporta JSX, pero se comporta
// bien si lo importás desde componentes client.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export type FirebaseClients = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  provider: GoogleAuthProvider | null;
  isConfigured: boolean;
  isBrowser: boolean;
};

function getConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // opcional
  };
}

export function getFirebase(): FirebaseClients {
  const isBrowser = typeof window !== "undefined";
  const cfg = getConfig();

  // Si corre en SSR/Edge, no inicializar SDKs del navegador.
  if (!isBrowser) {
    return {
      app: null,
      auth: null,
      db: null,
      provider: null,
      isConfigured: false,
      isBrowser,
    };
  }

  const isConfigured = Object.values(cfg).every(
    (v) => v === undefined || (typeof v === "string" && v.length > 0)
  );

  if (!isConfigured) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[firebase] NEXT_PUBLIC_* no configuradas. Firebase deshabilitado.");
    }
    return { app: null, auth: null, db: null, provider: null, isConfigured, isBrowser };
  }

  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  return { app, auth, db, provider, isConfigured, isBrowser };
}
