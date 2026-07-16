import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

// ─── Register new merchant ────────────────────────────────────────────────────
export async function registerMerchant(
  email: string,
  password: string,
  businessName: string,
  phone: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const now = serverTimestamp();

  // Create merchant document (UID doubles as merchantId for simplicity)
  await setDoc(doc(db, 'merchants', uid), {
    name: businessName,
    phone,
    email,
    category: 'general',
    address: '',
    city: '',
    totalOutstanding: 0,
    totalCollected: 0,
    customerCount: 0,
    ownerId: uid,
    createdAt: now,
    updatedAt: now,
  });

  // Create user doc
  await createUserDoc(uid, email, uid);

  return credential.user;
}

// ─── Auth state observer (returns unsubscribe) ────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
