import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PaymentDoc, PaymentMethod } from '../types';
import { applyPaymentToDebt } from './debtService';
import { updateCustomer, adjustTrustScore } from './customerService';
import { updateMerchantAggregates } from './merchantService';

const COL = 'payments';

// ─── Sort helper (client-side — avoids composite index requirement) ────────────
function sortByCreatedAtDesc(docs: PaymentDoc[]): PaymentDoc[] {
  return [...docs].sort((a, b) => {
    const aT = (a.createdAt as any)?.seconds ?? 0;
    const bT = (b.createdAt as any)?.seconds ?? 0;
    return bT - aT;
  });
}

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchPayments(merchantId: string): Promise<PaymentDoc[]> {
  // No orderBy — avoids composite index. Sorted client-side.
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc));
  return sortByCreatedAtDesc(docs);
}

// ─── Fetch for a single debt ──────────────────────────────────────────────────
export async function fetchPaymentsForDebt(debtId: string): Promise<PaymentDoc[]> {
  // Single-field where — no composite index needed.
  const q = query(
    collection(db, COL),
    where('debtId', '==', debtId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc));
  return sortByCreatedAtDesc(docs);
}

// ─── Record a payment (also updates debt + customer totals) ───────────────────
export async function recordPayment(params: {
  debtId: string;
  merchantId: string;
  customerId: string;
  amount: number;
  currentRemaining: number;
  currentCustomerPaid: number;
  paymentMethod: PaymentMethod;
  dueDate?: Timestamp | null;
}): Promise<string> {
  const now = serverTimestamp();

  // 1. Write payment document
  const ref_ = await addDoc(collection(db, COL), {
    debtId: params.debtId,
    merchantId: params.merchantId,
    customerId: params.customerId,
    amount: params.amount,
    status: 'completed' as const,
    paymentMethod: params.paymentMethod,
    createdAt: now,
  });

  // 2. Update the debt's remaining amount
  await applyPaymentToDebt(params.debtId, params.amount, params.currentRemaining);

  // 3. Update the customer's totalPaid aggregate
  await updateCustomer(params.customerId, {
    totalPaid: params.currentCustomerPaid + params.amount,
    totalDebt: Math.max(0, (params.currentRemaining ?? params.amount) - params.amount),
  });

  // 4. Update merchant aggregates
  await updateMerchantAggregates(params.merchantId, {
    totalOutstandingDelta: -params.amount,
    totalCollectedDelta: params.amount,
  });

  // 5. Trust score adjustment
  const isFullPayment = params.amount >= params.currentRemaining;
  if (isFullPayment && params.dueDate && params.dueDate.toMillis() > Date.now()) {
    await adjustTrustScore(params.customerId, 5);  // paid in full before due date
  } else if (!isFullPayment) {
    await adjustTrustScore(params.customerId, -3); // partial payment
  }

  return ref_.id;
}

// ─── Real-time listener ───────────────────────────────────────────────────────
// No orderBy — avoids composite index. Sorted client-side.
export function subscribePayments(
  merchantId: string,
  callback: (payments: PaymentDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc));
      callback(sortByCreatedAtDesc(docs));
    },
    (err) => {
      console.error('[paymentService] subscribePayments error:', err);
      onError?.(err);
      callback([]);
    }
  );
}
