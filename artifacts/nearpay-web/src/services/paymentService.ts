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
import { db, auth } from '../lib/firebase';
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

// ─── Record a payment via the API server (customer payment page) ──────────────
//
//  Previously this function wrote directly to Firestore from the client. That
//  approach had a broken access control: any authenticated user could insert
//  payment records for any merchant by referencing a debt with a paymentToken,
//  because the phone-based identity anchor in Firestore rules was forgeable
//  (customerProfiles.phone is set by the client at account creation time).
//
//  Payment creation is now handled by POST /api/payments/record on the API
//  server, which uses the Firebase Admin SDK to:
//    (a) cryptographically verify the caller's Firebase ID token (not forgeable)
//    (b) look up the debt by paymentToken server-side (Admin SDK bypasses rules)
//    (c) compare the verified caller phone against debt.customerPhone before
//        writing the payment document or updating any aggregates
//    (d) perform all writes atomically in a single Admin batch
//
//  The caller only supplies the paymentToken (from the URL), the amount, and
//  the payment method — the API server reads everything else from Firestore.
export async function recordPayment(params: {
  paymentToken: string;
  amount: number;
  paymentMethod: PaymentMethod;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const idToken = await user.getIdToken();

  const response = await fetch('/api/payments/record', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      paymentToken:  params.paymentToken,
      amount:        params.amount,
      paymentMethod: params.paymentMethod,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error((body['error'] as string) ?? `Payment failed (HTTP ${response.status})`);
  }

  const data = await response.json() as { paymentId: string };
  return data.paymentId;
}

// ─── Record a payment from the merchant dashboard (merchant identity path) ────
//
//  Merchants record in-person or manually-verified payments directly from their
//  dashboard. This path uses the Firebase Client SDK with the authenticated
//  merchant's own token, which is subject to Firestore rules that scope all
//  creates and updates to the merchant's own merchantId. This is a separate,
//  correctly-scoped trust boundary from the customer payment path above.
export async function recordPaymentAsMerchant(params: {
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

  // 1. Write payment document (allowed by the isMerchant() Firestore rule)
  const ref_ = await addDoc(collection(db, COL), {
    debtId:        params.debtId,
    merchantId:    params.merchantId,
    customerId:    params.customerId,
    amount:        params.amount,
    status:        'completed' as const,
    paymentMethod: params.paymentMethod,
    createdAt:     now,
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
    totalCollectedDelta:   params.amount,
  });

  // 5. Trust score adjustment
  const isFullPayment = params.amount >= params.currentRemaining;
  if (isFullPayment && params.dueDate && params.dueDate.toMillis() > Date.now()) {
    await adjustTrustScore(params.customerId, 5);   // paid in full before due date
  } else if (!isFullPayment) {
    await adjustTrustScore(params.customerId, -3);  // partial payment
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
