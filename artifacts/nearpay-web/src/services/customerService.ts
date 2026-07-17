import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomerDoc } from '../types';

const COL = 'customers';

// ─── Sort helper (client-side — avoids composite index requirement) ────────────
function sortByCreatedAtDesc(docs: CustomerDoc[]): CustomerDoc[] {
  return [...docs].sort((a, b) => {
    const aT = (a.createdAt as any)?.seconds ?? 0;
    const bT = (b.createdAt as any)?.seconds ?? 0;
    return bT - aT;
  });
}

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchCustomers(merchantId: string): Promise<CustomerDoc[]> {
  // NOTE: no orderBy — avoids requiring a composite index in Firestore.
  // Results are sorted client-side.
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerDoc));
  return sortByCreatedAtDesc(docs);
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

// ─── Update (setDoc merge — safe even if fields are missing or doc is new) ────
export async function updateCustomer(
  id: string,
  data: Partial<Omit<CustomerDoc, 'id' | 'createdAt'>>
): Promise<void> {
  await setDoc(
    doc(db, COL, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteCustomer(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ─── Adjust trust score (clamped 0–100) ─────────────────────────────────────
export async function adjustTrustScore(customerId: string, delta: number): Promise<void> {
  const customer = await fetchCustomer(customerId);
  if (!customer) return;
  const newScore = Math.max(0, Math.min(100, customer.trustScore + delta));
  await setDoc(
    doc(db, COL, customerId),
    { trustScore: newScore, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// ─── Check if phone already exists within a merchant ─────────────────────────
export async function checkPhoneExists(merchantId: string, phone: string): Promise<CustomerDoc | null> {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    where('phone', '==', phone)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as CustomerDoc;
}

// ─── Real-time listener ───────────────────────────────────────────────────────
// Uses where() only — no orderBy — so no composite index is needed.
// Documents are sorted client-side after each snapshot.
export function subscribeCustomers(
  merchantId: string,
  callback: (customers: CustomerDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerDoc));
      callback(sortByCreatedAtDesc(docs));
    },
    (err) => {
      console.error('[customerService] subscribeCustomers error:', err);
      onError?.(err);
      callback([]); // unblock UI
    }
  );
}
