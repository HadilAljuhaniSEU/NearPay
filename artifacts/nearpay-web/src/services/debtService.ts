import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DebtDoc, DebtStatus, ApprovalStatus } from '../types';
import { generateToken, generateReferenceNumber } from '../lib/tokens';

const COL = 'debts';

// ─── Sort helper (client-side — avoids composite index requirement) ────────────
function sortByCreatedAtDesc(docs: DebtDoc[]): DebtDoc[] {
  return [...docs].sort((a, b) => {
    const aT = (a.createdAt as any)?.seconds ?? 0;
    const bT = (b.createdAt as any)?.seconds ?? 0;
    return bT - aT;
  });
}

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchDebts(merchantId: string): Promise<DebtDoc[]> {
  // No orderBy — avoids composite index. Sorted client-side.
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtDoc));
  return sortByCreatedAtDesc(docs);
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
): Promise<{ id: string; approvalToken: string; paymentToken: string; referenceNumber: string }> {
  const now = serverTimestamp();
  const approvalToken = generateToken();
  const paymentToken  = generateToken();
  const referenceNumber = generateReferenceNumber();
  const ref_ = await addDoc(collection(db, COL), {
    ...data,
    approvalToken,
    paymentToken,
    referenceNumber,
    paymentStatus: 'unpaid',
    createdAt: now,
    updatedAt: now,
  });
  return { id: ref_.id, approvalToken, paymentToken, referenceNumber };
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
    approvalStatus === 'approved' ? 'active' :
    approvalStatus === 'rejected' ? 'rejected' : 'pending';
  const updates: Record<string, unknown> = { approvalStatus, status, updatedAt: serverTimestamp() };
  if (approvalStatus === 'approved') updates.approvedAt = serverTimestamp();
  await updateDoc(doc(db, COL, id), updates);
}

// ─── Dispute ──────────────────────────────────────────────────────────────────
export async function updateDebtDispute(id: string, reason: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    approvalStatus: 'disputed' as ApprovalStatus,
    disputeReason: reason,
    disputedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ─── Record partial/full payment (reduces remainingAmount) ───────────────────
export async function applyPaymentToDebt(
  id: string,
  paidAmount: number,
  currentRemaining: number
): Promise<void> {
  const newRemaining   = Math.max(0, currentRemaining - paidAmount);
  const status: DebtStatus = newRemaining === 0 ? 'settled' : 'active';
  const paymentStatus  = newRemaining === 0 ? 'paid' : 'partial';
  const updates: Record<string, unknown> = {
    remainingAmount: newRemaining,
    status,
    paymentStatus,
    updatedAt: serverTimestamp(),
  };
  if (newRemaining === 0) updates.paidAt = serverTimestamp();
  await updateDoc(doc(db, COL, id), updates);
}

// ─── General update ───────────────────────────────────────────────────────────
export async function updateDebt(
  id: string,
  data: Partial<Omit<DebtDoc, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ─── Real-time listener by customer phone ────────────────────────────────────
export function subscribeDebtsByCustomerPhone(
  phone: string,
  callback: (debts: DebtDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  // Single-field where — no composite index needed.
  const q = query(
    collection(db, COL),
    where('customerPhone', '==', phone)
  );
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtDoc));
      callback(sortByCreatedAtDesc(docs));
    },
    (err) => {
      console.error('[debtService] subscribeDebtsByCustomerPhone error:', err);
      onError?.(err);
      callback([]);
    }
  );
}

// ─── Real-time listener for single debt ──────────────────────────────────────
export function subscribeDebt(
  id: string,
  callback: (debt: DebtDoc | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, COL, id),
    (snap) => {
      callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as DebtDoc) : null);
    },
    (err) => {
      console.error('[debtService] subscribeDebt error:', err);
      onError?.(err);
      callback(null);
    }
  );
}

// ─── Real-time listener for all debts of a merchant ──────────────────────────
// No orderBy — avoids composite index. Sorted client-side.
export function subscribeDebts(
  merchantId: string,
  callback: (debts: DebtDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DebtDoc));
      callback(sortByCreatedAtDesc(docs));
    },
    (err) => {
      console.error('[debtService] subscribeDebts error:', err);
      onError?.(err);
      callback([]); // unblock UI
    }
  );
}
