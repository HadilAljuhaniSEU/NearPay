---
name: Firestore Operations
description: Root causes of Add Customer / Create Debt failures and the fixes applied
---

## Root Causes (all fixed)

### 1. Composite Index Requirement (CRITICAL)
Every Firestore query combining `where()` + `orderBy()` on different fields requires a manually-created composite index in the Firebase console. Without it, `onSnapshot` throws a `FirebaseError` that was silently swallowed — causing `loading` to stay `true` forever and the customer list to never appear.

**Fix:** Removed `orderBy` from ALL Firestore queries in `customerService`, `debtService`, `paymentService`. Results sorted client-side with a `sortByCreatedAtDesc` helper instead.

**Rule:** Never combine `where('fieldA', ...)` + `orderBy('fieldB', ...)` on different fields without a composite index. If you can't deploy the index via Firebase CLI, sort client-side.

### 2. `updateDoc` on potentially-missing documents (CRITICAL)
`updateMerchantAggregates` used `updateDoc` which throws "No document to update" if the merchant doc is missing aggregate fields (legacy accounts) or doesn't exist. This caused `handleSubmit` in AddDebtPage to fail even after the debt was written.

**Fix:** Changed `updateMerchantAggregates` to use `setDoc(..., { merge: true })`. Also changed `updateCustomer` to use `setDoc+merge`. Added `ensureMerchantAggregates()` called on login to backfill missing fields for legacy accounts.

**Rule:** Prefer `setDoc(..., { merge: true })` over `updateDoc` for aggregate fields — it is safe for both new and existing documents.

### 3. No error handlers on `onSnapshot` (CRITICAL)
All subscription functions passed no error callback to `onSnapshot`. Firestore index errors or permission errors were silently swallowed; `loading` never resolved, UI was blocked.

**Fix:** All `subscribeX` functions now accept an optional `onError` callback passed to `onSnapshot` as third argument. On error they log to `console.error` and call `callback([])` to unblock the UI.

### 4. Auto-create customer guard in AddDebtPage (REQUIREMENT)
Added a guard in `handleSubmit` that calls `fetchCustomer()` before creating a debt and re-creates the customer doc if not found.

### 5. Aggregate updates isolated with `Promise.allSettled`
Merchant + customer aggregate updates in AddDebtPage wrapped in `Promise.allSettled` so a failed aggregate write never blocks the success screen.

## Collection Structure

| Collection | Key fields | Doc ID |
|---|---|---|
| `merchants` | uid, businessName, name(=businessName), ownerId(=uid), totalOutstanding, totalCollected, customerCount | Firebase UID |
| `users` | uid, email, role, merchantId | Firebase UID |
| `customers` | merchantId, fullName, phone, email, trustScore, totalDebt, totalPaid | auto-id |
| `debts` | merchantId, customerId, customerName, customerPhone, amount, remainingAmount, status, approvalStatus, approvalToken, paymentToken | auto-id |
| `payments` | debtId, merchantId, customerId, amount, status, paymentMethod | auto-id |
| `merchant_settings` | merchantId, settings fields | merchant UID |

**Note:** `customers` collection is also used by phone-auth flow (doc at `customers/{uid}`) with different fields (uid, phone, displayName). The merchant-customer records use auto-IDs and always have `merchantId` — the `where('merchantId', '==', ...)` query correctly excludes auth-only docs.

## Why `fullName` not `name`
The requirement spec says `name` but the entire UI layer uses `fullName` and the user said "Do NOT modify UI". The stored field is `fullName`.
