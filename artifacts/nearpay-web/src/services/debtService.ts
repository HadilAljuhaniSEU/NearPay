import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DebtDoc, DebtStatus, ApprovalStatus } from '../types';
import { generateToken } from '../lib/tokens';

const COL = 'debts';

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchDebts(merchantId: string): Promise<DebtDoc[]> {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtDoc));
}

// ─── Fetch single ─────────────────────────────────────────────────────────────
export async function fetchDebt(id: string): Promise<DebtDoc | null> {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as DebtDoc) : null;
}

// ─── Fetch by approval token (public) ────────────────────────────────────────
export async function fetchDebtByApprovalToken(token: string): Promise<DebtDoc | null> {
  const q = query(collection(db, COL), where('approvalToken', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as DebtDoc;
}

// ─── Fetch by payment token (public) ─────────────────────────────────────────
export async function fetchDebtByPaymentToken(token: string): Promise<DebtDoc | null> {
  const q = query(collection(db, COL), where('paymentToken', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as DebtDoc;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createDebt(
  data: Omit<DebtDoc, 'id' | 'createdAt' | 'updatedAt' | 'approvalToken' | 'paymentToken'>
): Promise<string> {
  const now = serverTimestamp();
  const ref_ = await addDoc(collection(db, COL), {
    ...data,
    approvalToken: generateToken(),
    paymentToken: generateToken(),
    createdAt: now,
    updatedAt: now,
  });
  return ref_.id;
}

// ─── Update status ────────────────────────────────────────────────────────────
export async function updateDebtStatus(
  id: string,
  status: DebtStatus
): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
}

// ─── Update approval status (called from public link) ────────────────────────
export async function updateDebtApproval(
  id: string,
  approvalStatus: ApprovalStatus
): Promise<void> {
  const status: DebtStatus =
    approvalStatus === 'approved'
      ? 'active'
      : approvalStatus === 'rejected'
      ? 'rejected'
      : 'pending';
  await updateDoc(doc(db, COL, id), {
    approvalStatus,
    status,
    updatedAt: serverTimestamp(),
  });
}

// ─── Record partial/full payment (reduces remainingAmount) ───────────────────
export async function applyPaymentToDebt(
  id: string,
  paidAmount: number,
  currentRemaining: number
): Promise<void> {
  const newRemaining = Math.max(0, currentRemaining - paidAmount);
  const status: DebtStatus = newRemaining === 0 ? 'settled' : 'active';
  await updateDoc(doc(db, COL, id), {
    remainingAmount: newRemaining,
    status,
    updatedAt: serverTimestamp(),
  });
}

// ─── General update ───────────────────────────────────────────────────────────
export async function updateDebt(
  id: string,
  data: Partial<Omit<DebtDoc, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ─── Real-time listener ───────────────────────────────────────────────────────
export function subscribeDebts(
  merchantId: string,
  callback: (debts: DebtDoc[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtDoc)));
  });
}
