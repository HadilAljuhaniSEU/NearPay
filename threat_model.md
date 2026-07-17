# Threat Model

## Project Overview

NearPay is a merchant-facing payment and debt management platform. Merchants can register, add customers, create debt records, and track payments. Customers can view and approve debts, and make payments via tokenized URLs. The app uses Firebase (Firestore + Auth + Storage) for its backend, with a thin Express 5 API server for health/utility routes. The web frontend is a Vite/React app deployed publicly at `https://NearPay.replit.app`. A React Native mobile client (Expo) is also part of the project.

**Tech stack:** Node.js 24, TypeScript, Express 5, Firebase (Auth + Firestore + Storage), Vite/React, Expo/React Native, Drizzle ORM + PostgreSQL (for API server), pnpm workspaces.

## Assets

- **Debt records** — Financial obligation data (amounts, status, phone numbers, merchant/customer IDs). High-value PII and business data.
- **Customer PII** — Phone numbers (E.164), email addresses, display names stored in `customerProfiles` and `customers` collections.
- **Merchant business data** — Business profiles, financial aggregates (totalOutstanding, totalCollected), commercial registration numbers.
- **One-time tokens** — `approvalToken` and `paymentToken` (UUID v4) embedded in debt documents; act as capability proofs for debt approval and payment flows.
- **Firebase credentials** — API key, project ID, app ID stored in `.replit` and bundled into client JS. Controls access to Firebase services.
- **Firebase Auth sessions** — JWT tokens issued to authenticated users (merchants and customers).

## Trust Boundaries

- **Unauthenticated / Authenticated** — Firebase Auth gates most Firestore operations. Customer and merchant sessions are separate but issued by the same Firebase project.
- **Customer / Merchant** — Both are authenticated Firebase users but with different roles. Role is stored in `users/{uid}` (merchants) or `customerProfiles/{uid}` (customers). Firestore rules enforce separation.
- **Client / Firestore** — All business logic runs client-side directly against Firestore. There is no server-side validation layer beyond Firestore Security Rules.
- **Client / Express API** — The Express API server (`/api`) currently only exposes a health endpoint; no authentication middleware is applied.
- **Token-gated pages** — Debt approval and payment pages use UUID tokens embedded in URLs as capability proofs. Both pages require Firebase Auth before the token is used.

## Scan Anchors

- **Production entry point:** `artifacts/nearpay-web/` (React SPA) served at `https://NearPay.replit.app`
- **Firebase Security Rules:** `firestore.rules` — highest-risk file; controls all data access
- **Auth flows:** `artifacts/nearpay-web/src/services/authService.ts`, `artifacts/nearpay-web/src/lib/firebase.ts`
- **Payment/debt flows:** `artifacts/nearpay-web/src/services/paymentService.ts`, `artifacts/nearpay-web/src/services/debtService.ts`
- **Express API server:** `artifacts/api-server/src/` — minimal routes, low risk currently
- **Mobile server:** `artifacts/nearpay-mobile/server/serve.js` — static file server
- **Dev-only:** `artifacts/mockup-sandbox/` — Canvas/design artifact, not production

## Threat Categories

### Spoofing

Firebase Auth is used for both merchants and customers. Role assignment happens at registration by writing `role: 'merchant'` into `users/{uid}`. The rule prevents changing the `role` field after creation. Token-based flows require authentication first, then UUID token knowledge.

**Required guarantees:**
- All sensitive Firestore operations MUST require `request.auth != null`.
- The `role` field in `users/{uid}` MUST be immutable after creation (currently enforced).

### Tampering

Client-side code directly mutates Firestore. Firestore rules are the only enforcement layer. Several rules have overly broad write permissions:

- Any authenticated user can update `totalDebt`, `totalPaid`, `trustScore`, and `updatedAt` on ANY customer record (not scoped to a specific merchant or customer).
- Any authenticated user can create payment records for any debt that has a `paymentToken` set — the amount field is not validated server-side.

**Required guarantees:**
- Customer financial aggregate updates MUST be restricted to the specific customer's authenticated session or moved to a Cloud Function.
- Payment record creation MUST validate that the creating user is the debt's customer (via phone match) or be performed server-side.

### Information Disclosure

The Firestore token-based read rule for `debts` allows any authenticated user to read ALL debt documents that have a non-empty `approvalToken` or `paymentToken`. Since all active debts carry tokens, this effectively grants all authenticated users read access to the entire `debts` collection, including customer phone numbers, debt amounts, and merchant data.

Firebase credentials (API key, project ID, app ID) are committed to `.replit` as plain-text environment variables. The API key is also bundled into the client-side JS at build time, which is the intended Firebase design for web clients. However, the `.replit` file is version-controlled and accessible to any project collaborator.

**Required guarantees:**
- Token-based debt reads MUST require that the requesting user can prove knowledge of the token value (e.g. pass the token as a field match in the query/document read), not merely that the token field is non-empty.
- Firebase credentials MUST NOT be committed to version control; they should use Replit Secrets.

### Elevation of Privilege

The customer aggregate update rule (`customers/{customerId}`) does not restrict which customer document can be updated — any authenticated user can modify any customer's `totalDebt`, `totalPaid`, and `trustScore`. This allows a malicious authenticated user to set another merchant's customers' debt to zero or manipulate trust scores.

### Denial of Service

The Express API server has no rate limiting. Firestore client-side access is rate-limited by Firebase quotas. No other DoS protections are currently in scope given the minimal API surface.
