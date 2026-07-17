---
name: Phone Auth & Debt Lookup
description: How customer debt lookup works after email auth, phone normalization rules, and the post-login phone collection modal.
---

## The Problem
Firebase email auth gives `user.phoneNumber = null`. The old `useCustomerDebts` hook used `user.phoneNumber` to query debts, so email-auth customers always saw empty debt lists.

## The Fix
`useCustomerDebts.ts` now:
1. Reads `customerProfiles/{uid}` from Firestore on auth state change
2. Extracts `data.phone` from that doc
3. Normalizes it via `normalizeSaudiPhone()`
4. Uses the normalized phone for `subscribeDebtsByCustomerPhone()`

**Why:** `customerProfiles.phone` is the single source of truth for a customer's phone regardless of auth method.

## Phone Collection Modal
`CustomerAuthPage.tsx` — after successful sign-in OR sign-up:
1. Calls `fetchCustomerProfile(uid)`
2. If `profile.phone` is missing/empty → shows a modal to collect the Saudi mobile number
3. Modal validates + normalizes → calls `updateCustomerPhone(uid, normalized)` → stores in `customerProfiles.phone`
4. User can skip — they will just see no debts until phone is added

**Never ask again:** `createCustomerDoc` sets phone to `''` on first creation; modal only fires when phone is falsy, so once saved it never re-appears.

## Phone Normalization (`src/utils/phone.ts`)
`normalizeSaudiPhone(v)` handles:
- `05XXXXXXXX` → `+9665XXXXXXXX`
- `5XXXXXXXX` → `+9665XXXXXXXX`
- `9665XXXXXXXX` → `+9665XXXXXXXX`
- `+9665XXXXXXXX` → unchanged
- Strips spaces, dashes, parentheses before processing

`isValidSaudiPhone(v)` normalizes first, then checks `/^\+9665\d{8}$/`.

## Where normalization is applied
- `AddCustomerSheet.tsx` — normalizes before saving `customers.phone`
- `AddDebtPage.tsx` — normalizes `selectedCustomer.phone` before storing in `debts.customerPhone`
- `useCustomerDebts.ts` — normalizes `customerProfiles.phone` before querying debts
- `updateCustomerPhone()` in authService — always receives pre-normalized value from modal

**Why:** Every write path must normalize so the `where('customerPhone', '==', phone)` query always finds exact matches.

## Discover Page
`nearbyService.fetchVisibleMerchants()` now filters `isVisible === true` (in addition to lat/lng). Merchants must opt in via Settings → Discovery to appear.
