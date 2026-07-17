import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '../lib/firebaseAdmin.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/payments/record
//
//  Records a customer payment for a debt identified by its paymentToken.
//  Uses the Firebase Admin SDK so that:
//    (a) the caller's Firebase ID token is cryptographically verified
//    (b) the debt, customer, and merchant documents are read/written with
//        admin privileges — no client-writable Firestore field can be spoofed
//
//  Request headers:
//    Authorization: Bearer <Firebase ID token>
//
//  Request body (JSON):
//    paymentToken  — the token from the /pay/:token URL
//    amount        — positive number, must be ≤ remaining balance
//    paymentMethod — 'cash' | 'card' | 'stcpay' | 'bank_transfer'
//
//  Response (200):
//    { paymentId: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/payments/record', async (req, res) => {
  // ── 1. Verify Firebase ID token ──────────────────────────────────────────
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const idToken = authHeader.slice(7);
  let decodedToken: Awaited<ReturnType<ReturnType<typeof adminAuth>['verifyIdToken']>>;
  try {
    decodedToken = await adminAuth().verifyIdToken(idToken);
  } catch {
    res.status(401).json({ error: 'Invalid Firebase ID token' });
    return;
  }

  const uid = decodedToken.uid;

  // ── 2. Parse and validate request body ───────────────────────────────────
  const { paymentToken, amount, paymentMethod } = req.body as {
    paymentToken?: unknown;
    amount?: unknown;
    paymentMethod?: unknown;
  };

  if (typeof paymentToken !== 'string' || !paymentToken) {
    res.status(400).json({ error: 'paymentToken is required' });
    return;
  }
  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'amount must be a positive number' });
    return;
  }
  const method = typeof paymentMethod === 'string' ? paymentMethod : 'cash';

  const db = adminDb();

  // ── 3. Look up the debt by paymentToken ──────────────────────────────────
  const debtsSnap = await db.collection('debts')
    .where('paymentToken', '==', paymentToken)
    .limit(1)
    .get();

  if (debtsSnap.empty) {
    res.status(404).json({ error: 'Debt not found or payment link has expired' });
    return;
  }

  const debtRef = debtsSnap.docs[0].ref;
  const debt    = debtsSnap.docs[0].data();

  // ── 4. Validate debt state ────────────────────────────────────────────────
  if (debt['status'] === 'settled') {
    res.status(409).json({ error: 'Debt is already settled' });
    return;
  }
  if (debt['approvalStatus'] !== 'approved') {
    res.status(403).json({ error: 'Debt has not been approved for payment yet' });
    return;
  }
  if (amount > (debt['remainingAmount'] as number)) {
    res.status(400).json({ error: 'Payment amount exceeds the remaining balance' });
    return;
  }

  // ── 5. Verify caller identity ─────────────────────────────────────────────
  // Prefer the phone_number claim from the Firebase Auth JWT — this is set by
  // Firebase when the user authenticates via Phone (SMS OTP) and cannot be
  // forged by the client.
  // Fall back to the phone stored in customerProfiles/{uid}. That field is
  // protected by a Firestore rule that makes it immutable once set, so an
  // existing account cannot change its phone to impersonate another customer.
  // The Admin SDK read here bypasses client-side rules, so the value comes
  // directly from Firestore without passing through any client-writable path.
  let callerPhone: string | null = (decodedToken as Record<string, unknown>)['phone_number'] as string ?? null;

  if (!callerPhone) {
    const profileSnap = await db.collection('customerProfiles').doc(uid).get();
    if (!profileSnap.exists) {
      res.status(403).json({
        error: 'Customer profile not found. Please complete registration before paying.',
      });
      return;
    }
    callerPhone = (profileSnap.data()?.['phone'] as string) ?? null;
  }

  if (!callerPhone || callerPhone !== debt['customerPhone']) {
    res.status(403).json({ error: 'Not authorised to pay this debt' });
    return;
  }

  // ── 6. Perform all writes atomically ─────────────────────────────────────
  const now          = FieldValue.serverTimestamp();
  const remaining    = debt['remainingAmount'] as number;
  const newRemaining = Math.max(0, remaining - amount);
  const isSettled    = newRemaining === 0;

  const batch = db.batch();

  // Payment document (audit log entry)
  const paymentRef = db.collection('payments').doc();
  batch.set(paymentRef, {
    debtId:        debtsSnap.docs[0].id,
    merchantId:    debt['merchantId'],
    customerId:    debt['customerId'],
    amount,
    status:        'completed',
    paymentMethod: method,
    createdAt:     now,
  });

  // Debt update
  const debtUpdates: Record<string, unknown> = {
    remainingAmount: newRemaining,
    status:          isSettled ? 'settled' : 'active',
    paymentStatus:   isSettled ? 'paid'    : 'partial',
    updatedAt:       now,
  };
  if (isSettled) debtUpdates['paidAt'] = now;
  batch.update(debtRef, debtUpdates);

  // Customer aggregate update (previously blocked on client by security rules)
  const customerId  = debt['customerId'] as string;
  const customerRef = db.collection('customers').doc(customerId);
  const customerSnap = await customerRef.get();

  if (customerSnap.exists) {
    const customer       = customerSnap.data()!;
    const currentScore   = (customer['trustScore'] as number) ?? 50;
    const currentTotal   = (customer['totalDebt']  as number) ?? 0;
    let   trustDelta     = 0;
    const dueDateMillis  = (debt['dueDate'] as FirebaseFirestore.Timestamp | null)?.toMillis?.() ?? 0;

    if (isSettled && dueDateMillis > Date.now()) {
      trustDelta = 5;   // paid in full before due date
    } else if (!isSettled) {
      trustDelta = -3;  // partial payment
    }

    batch.set(customerRef, {
      totalPaid:  FieldValue.increment(amount),
      totalDebt:  Math.max(0, currentTotal - amount),
      trustScore: Math.max(0, Math.min(100, currentScore + trustDelta)),
      updatedAt:  now,
    }, { merge: true });
  }

  // Merchant aggregate update
  const merchantRef = db.collection('merchants').doc(debt['merchantId'] as string);
  batch.update(merchantRef, {
    totalOutstanding: FieldValue.increment(-amount),
    totalCollected:   FieldValue.increment(amount),
    updatedAt:        now,
  });

  await batch.commit();

  res.status(200).json({ paymentId: paymentRef.id });
});

export default router;
