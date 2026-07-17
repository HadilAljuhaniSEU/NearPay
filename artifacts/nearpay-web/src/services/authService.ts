import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, serverTimestamp,
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserDoc, CustomerAuthDoc } from '../types';

// ─── Sign In (Merchant) ───────────────────────────────────────────────────────
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
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

// ─── Create user linking doc ──────────────────────────────────────────────────
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

// ─── Check if CR already exists ───────────────────────────────────────────────
export async function checkCRExists(cr: string): Promise<boolean> {
  const q = query(
    collection(db, 'merchants'),
    where('commercialRegistration', '==', cr.trim())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

// ─── Register new merchant ────────────────────────────────────────────────────
export interface RegisterMerchantParams {
  businessName: string;
  commercialRegistration: string;
  businessType?: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  city?: string;
  language?: 'en' | 'ar';
}

export async function registerMerchant(params: RegisterMerchantParams): Promise<User> {
  const {
    businessName, commercialRegistration, businessType = '',
    ownerName, email, phone, password,
    address = '', city = '', language = 'en',
  } = params;

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const now = serverTimestamp();

  // Write merchant document — doc ID is the Firebase UID
  await setDoc(doc(db, 'merchants', uid), {
    uid,
    businessName,
    commercialRegistration: commercialRegistration.trim(),
    businessType,
    ownerName,
    email,
    phone,
    role: 'merchant',
    status: 'active',
    language,
    trustScore: 100,
    createdAt: now,
    // Aggregates
    totalOutstanding: 0,
    totalCollected: 0,
    customerCount: 0,
    // Legacy compat aliases
    name: businessName,
    ownerId: uid,
    address,
    city,
  });

  // Create user linking doc
  await createUserDoc(uid, email, uid);

  return credential.user;
}

// ─── Update merchant language preference ─────────────────────────────────────
export async function updateMerchantLanguage(
  uid: string,
  language: 'en' | 'ar'
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'merchants', uid),
      { language },
      { merge: true }
    );
  } catch {
    // Non-critical — silently ignore
  }
}

// ─── Phone OTP — Customer Authentication ─────────────────────────────────────
// TODO: Enable "Phone" as a sign-in method in Firebase Console →
//       Authentication → Sign-in method → Phone
// TODO: Ensure your app domain is added to Firebase Auth authorized domains.
// TODO: For production, configure App Check to prevent OTP abuse.

export function createRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => { /* reCAPTCHA solved */ },
    'expired-callback': () => { /* reCAPTCHA expired — user must retry */ },
  });
}

export async function sendPhoneOTP(
  phone: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phone, recaptchaVerifier);
}

export async function verifyPhoneOTP(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> {
  const credential = await confirmationResult.confirm(code);
  return credential.user;
}

// ─── Create / upsert customer doc ────────────────────────────────────────────
export async function createCustomerDoc(
  uid: string,
  phone: string,
  preferredLanguage: 'en' | 'ar' = 'en'
): Promise<void> {
  const ref = doc(db, 'customers', uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return; // already created on a previous login

  await setDoc(ref, {
    uid,
    phone,
    displayName: '',
    createdAt: serverTimestamp(),
    preferredLanguage,
  } satisfies Omit<CustomerAuthDoc, 'createdAt'> & Record<string, unknown>);
}

// ─── Auth state observer ──────────────────────────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
