// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

let app: admin.app.App | undefined;

export function getAdminApp() {
  if (!app) {
    const env = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!admin.apps.length) {
      if (env) {
        const sa = JSON.parse(env);
        app = admin.initializeApp({ credential: admin.credential.cert(sa) });
      } else {
        app = admin.initializeApp({ credential: admin.credential.applicationDefault() });
      }
    } else {
      app = admin.app();
    }
  }
  return app!;
}

export function getAdminDb() {
  return getAdminApp().firestore();
}
