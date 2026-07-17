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
export interface RegisterMerchantParams {
  email: string;
  password: string;
  ownerName: string;
  storeName: string;
  commercialRegistration: string;
  businessType: string;
  city: string;
  phone: string;
}

export async function registerMerchant(params: RegisterMerchantParams): Promise<User> {
  const {
    email, password, ownerName, storeName,
    commercialRegistration, businessType, city, phone,
  } = params;

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const now = serverTimestamp();

  // Create merchant document in `merchants` collection
  await setDoc(doc(db, 'merchants', uid), {
    merchantId: uid,
    ownerName,
    storeName,
    commercialRegistration,
    businessType,
    city,
    phone,
    email,
    // Legacy fields kept for backward compat
    name: storeName,
    category: businessType,
    address: '',
    logoUrl: null,
    totalOutstanding: 0,
    totalCollected: 0,
    customerCount: 0,
    ownerId: uid,
    // Onboarding status
    status: 'pending',
    verified: false,
    trustScore: 0,
    location: null,
    createdAt: now,
    updatedAt: now,
  });

  // Create user doc linking Firebase Auth UID → merchant doc
  await createUserDoc(uid, email, uid);

  return credential.user;
}

// ─── Auth state observer (returns unsubscribe) ────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
