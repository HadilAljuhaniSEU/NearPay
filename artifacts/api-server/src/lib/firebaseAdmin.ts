import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// ── Lazy singleton initialisation ─────────────────────────────────────────────
// Reads FIREBASE_SERVICE_ACCOUNT_JSON (a JSON-encoded service account key) from
// the environment. Set this secret in Replit Secrets (Settings → Secrets).
// Obtain the key from the Firebase console:
//   Project Settings → Service Accounts → Generate new private key.
function initAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT_JSON'];
  if (!serviceAccountJson) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. ' +
      'Add the Firebase service account JSON as a Replit Secret.'
    );
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

/** Firebase Admin Auth instance (for verifyIdToken). */
export const adminAuth = () => getAuth(initAdmin());

/** Firebase Admin Firestore instance (bypasses security rules). */
export const adminDb = () => getFirestore(initAdmin());
