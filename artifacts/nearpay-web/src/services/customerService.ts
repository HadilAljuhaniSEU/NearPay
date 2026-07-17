import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { CustomerDoc } from '../types';

const COL = 'customers';

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchCustomers(merchantId: string): Promise<CustomerDoc[]> {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerDoc));
}

// ─── Fetch single ─────────────────────────────────────────────────────────────
export async function fetchCustomer(id: string): Promise<CustomerDoc | null> {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CustomerDoc) : null;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createCustomer(
  data: Omit<CustomerDoc, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = serverTimestamp();
  const ref_ = await addDoc(collection(db, COL), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return ref_.id;
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateCustomer(
  id: string,
  data: Partial<Omit<CustomerDoc, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteCustomer(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ─── Upload avatar ────────────────────────────────────────────────────────────
export async function uploadCustomerAvatar(
  customerId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `customer_avatars/${customerId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Adjust trust score (clamped 0–100) ─────────────────────────────────────
export async function adjustTrustScore(customerId: string, delta: number): Promise<void> {
  const customer = await fetchCustomer(customerId);
  if (!customer) return;
  const newScore = Math.max(0, Math.min(100, customer.trustScore + delta));
  await updateDoc(doc(db, COL, customerId), { trustScore: newScore, updatedAt: serverTimestamp() });
}

// ─── Real-time listener ───────────────────────────────────────────────────────
export function subscribeCustomers(
  merchantId: string,
  callback: (customers: CustomerDoc[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerDoc)));
  });
}
