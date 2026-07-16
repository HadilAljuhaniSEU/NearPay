import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserDoc } from '../types';

// ─── Sign In ──────────────────────────────────────────────────────────────────
export async function signInMerchant(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<User> {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  );
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOutMerchant(): Promise<void> {
  await signOut(auth);
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetMerchantPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ─── Fetch user doc from Firestore ───────────────────────────────────────────
export async function fetchUserDoc(uid: string): Promise<UserDoc | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

// ─── Create user doc (called after first sign-in / registration) ─────────────
export async function createUserDoc(
  uid: string,
  email: string,
  merchantId: string
): Promise<void> {
  const ref = doc(db, 'users', uid);
  const now = serverTimestamp();
  await setDoc(
    ref,
    {
      uid,
      email,
      role: 'merchant',
      merchantId,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<UserDoc, 'createdAt' | 'updatedAt'> & Record<string, unknown>,
    { merge: true }
  );
}

// ─── Auth state observer (returns unsubscribe) ────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
