import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PaymentDoc, PaymentMethod } from '../types';
import { applyPaymentToDebt } from './debtService';
import { updateCustomer, adjustTrustScore } from './customerService';
import { updateMerchantAggregates } from './merchantService';
import { Timestamp } from 'firebase/firestore';

const COL = 'payments';

// ─── Fetch all for a merchant ─────────────────────────────────────────────────
export async function fetchPayments(merchantId: string): Promise<PaymentDoc[]> {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc));
}

// ─── Fetch for a single debt ──────────────────────────────────────────────────
export async function fetchPaymentsForDebt(debtId: string): Promise<PaymentDoc[]> {
  const q = query(
    collection(db, COL),
    where('debtId', '==', debtId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc));
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
export function subscribePayments(
  merchantId: string,
  callback: (payments: PaymentDoc[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('merchantId', '==', merchantId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentDoc)));
  });
}
