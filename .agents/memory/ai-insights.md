---
name: AI & Insights module
description: How the local financial intelligence engine is built in NearPay Web
---

## Architecture
All computation is local — no external AI APIs. Pure functions in `src/services/insightsService.ts` take Firestore data (debts, customers, payments) as arguments and return derived analytics.

## insightsService.ts exports
- `computeCustomerTrustScore(debts)` — rule engine: start 100, -10 late, -3 partial, -8 disputed, -15 if >3 overdue, +5 early
- `trustScoreLabel(score)` → 'excellent' | 'good' | 'average' | 'high_risk'
- `trustScoreColor(score)` → hex string
- `classifyRisk(trustScore, outstanding, overdueCount)` → 'low' | 'medium' | 'high'
- `buildCustomerRiskProfiles(customers, debts)` → sorted by risk desc
- `generateSmartInsights(debts, customers, payments)` → SmartInsight[] sorted by priority
- `buildCashFlowForecast(debts)` → { next7Total, next30Total, weekly[4], monthly[3] }
- `buildCollectionMetrics(debts, payments)` → { collectionRate, avgPaymentDelayDays, paidTotal, unpaidTotal, partialTotal, monthlyRecovery[6] }
- `generateSmartReminders(debts, customers)` → deduplicated by customer, highest urgency wins
- `buildCreditInsights(customers, debts)` → { topPaying, mostDelayed, highestOutstanding, fastestPaying, newestCustomers }

## AIPage.tsx (replaces old chat UI)
Full 5-tab dashboard at `/merchant/ai`:
1. Financial Health — collection rate circular gauge, paid/unpaid/partial bars, monthly recovery chart, Merchant Credit Insights
2. Smart Insights — insight cards (success/info/warning/danger) + Smart Reminders list
3. Trust Scores — distribution bars + per-customer circular progress SVG indicator
4. Cash Flow — weekly (4 wk) and monthly (3 mo) bar charts
5. Risk Analysis — risk summary tiles + per-customer risk profiles with suggested actions

## Circular progress
SVG circle with `strokeDashoffset` animated by Framer Motion. Rotated -90deg so it starts at top.

## TODO ML notes
Every scoring function has `// TODO ML:` comment indicating where trained model endpoints should replace rule engine.

**Why:** The spec required no external AI APIs. Rule engine is deterministic and explainable, suitable for MVP until enough data exists for ML.
