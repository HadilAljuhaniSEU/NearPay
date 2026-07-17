---
name: Brand & Stabilization
description: Production stabilization changes — brand colors, landing page, logo redesign, dark mode, registration form additions
---

## Brand Colors (as of production stabilization)
- **Primary blue**: `#0B5FFF` → CSS `--primary: 219 100% 52%`
- **Teal accent**: `#20D6C7` → CSS `--teal: 175 62% 48%`
- **Secondary teal** (chart/badge): `#0FB8A9` (replaced old `#19B8D3`)
- **Dark navy text**: `#0B2341` — kept as `--foreground` / `--navy` (NOT replaced)
- **Background**: `#F6F9FC` light, `#0D1929` dark

**Why:** Spec required rebrand from navy+teal to blue+teal. Navy stays as text/background color; blue is now the interactive primary.

**How to apply:** All new primary buttons should use blue gradient `linear-gradient(135deg, #0B5FFF, #0040CC)`. Teal is for accent icons, links, checkboxes. The global CSS button override in `index.css` applies the blue gradient to all `bg-primary` buttons automatically.

## Routing Architecture
- `/` → `LandingPage` (not `RootRedirect`). LandingPage checks auth and redirects to `/merchant/dashboard` if already logged in.
- `/login` → `LoginPage` (auth forms: merchant login, merchant register, customer access)
- All merchant routes wrapped in `ProtectedRoute` which redirects to `/login`

**Why:** User spec wanted a proper landing page, not direct jump to login form or dashboard.

## Dark Mode
- Toggle `.dark` class on `document.documentElement` via `useDarkMode` hook (`src/hooks/useDarkMode.ts`)
- Persisted to `localStorage` under key `nearpay_theme`
- Dark variables defined in `index.css` under `.dark {}` block
- `@custom-variant dark (&:is(.dark *))` in Tailwind 4 handles class propagation

## Logo
- New: map pin body (blue gradient `#1A6FFF → #0040CC`) + inner teal circle (`#25E4D4 → #10B8A8`) + stylised SAR riyal symbol (ر shape + two horizontal lines) in white
- File: `src/components/NearPayLogo.tsx` — `NearPayIcon` and `NearPayLogo` both updated
- `variant='white'` renders all in white for dark backgrounds

## Registration Form Additions
Added to signup form in `LoginPage.tsx` and `RegisterMerchantParams` in `authService.ts`:
- `businessType` — select from `BUSINESS_TYPES` (string array from nearbyService)
- `address` — text input, uses translation key `store_address`
- `city` — select from `SAUDI_CITIES`, uses translation key `biz_city`

**Translation keys**: use `select_business_type`, `store_address`, `biz_city` — NOT `business_type`, `address`, `city` (those don't exist in translations.ts)

## Language Switcher
- Urdu shown as disabled option with "Coming Soon" pill badge
- Never translates "Urdu" into Arabic script — always Latin
