import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function ensureAdminApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  return getApps()[0];
}

export function getFirestoreDb() {
  if (!ensureAdminApp()) return null;
  return getFirestore();
}

export function getAdminAuth() {
  if (!ensureAdminApp()) return null;
  return getAuth();
}

export async function verifyAdminSession(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  const auth = getAdminAuth();
  if (!auth) return null;

  try {
    return await auth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
