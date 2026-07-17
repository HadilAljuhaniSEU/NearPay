---
name: Customer Journey Architecture
description: How the public approval/payment links and customer pages work in NearPay Web
---

## URL structure
- Approval link: `/debt/approve/:token` where `:token` is `approvalToken` (32-byte hex, not debtId)
- Payment link: `/debt/pay/:token` where `:token` is `paymentToken` (32-byte hex)
- Both routes are public (no ProtectedRoute) but redirect to `/customer/otp?redirect=<path>` if Firebase auth `currentUser` is null

## Dispute flow
- "Dispute Debt" button → inline form (textarea for reason) → calls `updateDebtDispute(id, reason)`
- Sets `approvalStatus: 'disputed'`, `disputeReason`, `disputedAt` on the debt doc
- `ApprovalStatus` union now includes `'disputed'`
- Merchant dashboard picks up disputes via existing real-time `subscribeDebts` listener — no extra notification collection needed for MVP

## Payment modes (DebtPaymentPage)
- Three modes: Full (= remainingAmount), Half (= ceil(remaining/2)), Custom (user input)
- Validation: amount > 0 AND amount ≤ remainingAmount
- Minimum payment displayed: max(100, ceil(remaining × 0.1))
- Payment gateway TODOs in comments: Mada, Apple Pay, Google Pay, STC Pay
- Real payment history loaded via `fetchPaymentsForDebt(debt.id)` after debt loads

## Customer pages (useCustomerDebts hook)
- Auth: `onAuthStateChanged` → get `user.phoneNumber` (E.164 from Firebase phone auth)
- Query: `subscribeDebtsByCustomerPhone(phone, callback)` — Firestore `where('customerPhone','==',phone)`
- **Phone format must match**: merchant enters phone in same E.164 format as Firebase stores it
- Customer name derived from first debt's `customerName` field (Firebase phone auth has no displayName)
- CustomerPaymentsPage fetches payments per-debt via Promise.all — acceptable for MVP with <50 debts

## merchantName on debt
- Added `merchantName: merchant.name` to the `createDebt` call in AddDebtPage
- Stored on DebtDoc; used in approval/payment pages and customer home/debts pages to show business name
- Approval page also calls `fetchMerchant(debt.merchantId)` as fallback if merchantName field missing

**Why:** Token-based URLs are more secure than debtId-based; tokens are revocable and don't expose Firestore structure.
