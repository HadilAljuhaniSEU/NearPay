import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { MerchantDoc, MerchantSettingsDoc } from '../types';

const COL = 'merchants';
const SETTINGS_COL = 'merchant_settings';

// ─── Fetch by ID ──────────────────────────────────────────────────────────────
export async function fetchMerchant(id: string): Promise<MerchantDoc | null> {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as MerchantDoc) : null;
}

// ─── Fetch by owner UID ───────────────────────────────────────────────────────
export async function fetchMerchantByOwner(uid: string): Promise<MerchantDoc | null> {
  const q = query(collection(db, COL), where('ownerId', '==', uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as MerchantDoc;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createMerchant(
  id: string,
  data: Omit<MerchantDoc, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const now = serverTimestamp();
  await setDoc(doc(db, COL, id), { ...data, createdAt: now, updatedAt: now });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateMerchant(
  id: string,
  data: Partial<Omit<MerchantDoc, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ─── Upload logo ──────────────────────────────────────────────────────────────
export async function uploadMerchantLogo(
  merchantId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `merchant_logos/${merchantId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function fetchMerchantSettings(
  merchantId: string
): Promise<MerchantSettingsDoc | null> {
  const snap = await getDoc(doc(db, SETTINGS_COL, merchantId));
  return snap.exists() ? (snap.data() as MerchantSettingsDoc) : null;
}

export async function upsertMerchantSettings(
  merchantId: string,
  data: Partial<Omit<MerchantSettingsDoc, 'merchantId' | 'updatedAt'>>
): Promise<void> {
  await setDoc(
    doc(db, SETTINGS_COL, merchantId),
    { ...data, merchantId, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
