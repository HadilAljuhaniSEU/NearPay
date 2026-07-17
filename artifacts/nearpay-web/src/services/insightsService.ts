/**
 * insightsService.ts
 *
 * Pure local computation engine for NearPay AI & Financial Intelligence.
 * No external AI APIs. All insights are derived from Firestore data passed in.
 *
 * TODO: Future ML integration — replace each scoring function with a trained
 * model endpoint once sufficient historical data exists.
 */

import { DebtDoc, CustomerDoc, PaymentDoc } from '../types';
import { format, subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high';

export interface CustomerRiskProfile {
  customer: CustomerDoc;
  trustScore: number;
  outstanding: number;
  overdueCount: number;
  riskLevel: RiskLevel;
  suggestedAction: 'safe' | 'remind' | 'reduce_credit' | 'urgent';
}

export interface SmartInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  body: string;
  priority: number; // lower = higher priority
}

export interface SmartReminder {
  customerId: string;
  customerName: string;
  message: string;
  urgency: 'high' | 'medium' | 'low';
  daysOverdue?: number;
}

export interface CashFlowForecast {
  next7Total: number;
  next30Total: number;
  weekly: { label: string; amount: number }[];   // 4 weeks ahead
  monthly: { label: string; amount: number }[];  // 3 months ahead
}

export interface CollectionMetrics {
  collectionRate: number;          // 0–100 %
  avgPaymentDelayDays: number;     // average days late
  paidTotal: number;
  unpaidTotal: number;
  partialTotal: number;
  monthlyRecovery: { label: string; amount: number }[]; // last 6 months
}

export interface CreditInsights {
  topPaying: CustomerDoc[];         // highest totalPaid
  mostDelayed: CustomerDoc[];       // highest overdue debt count
  highestOutstanding: CustomerDoc[];
  fastestPaying: CustomerDoc[];     // highest trust score among settled
  newestCustomers: CustomerDoc[];   // most recently added
}

// ─── Trust Score ──────────────────────────────────────────────────────────────

/**
 * Compute dynamic trust score for a single customer from their debt history.
 *
 * Algorithm (per spec):
 *   Start at 100
 *   Late payment (overdue):   -10 per debt
 *   Partial payment:          -3  per debt
 *   Early payment (settled before due date): +5 per debt
 *   More than 3 overdue debts: -15 (flat)
 *   Debt disputed:            -8  per debt
 *
 * TODO: ML — replace rule engine with a trained gradient-boost model
 * using repayment history time-series once N > 500 customers.
 */
export function computeCustomerTrustScore(customerDebts: DebtDoc[]): number {
  let score = 100;

  const overdueDebts   = customerDebts.filter(d => d.status === 'overdue');
  const partialDebts   = customerDebts.filter(d => d.paymentStatus === 'partial');
  const disputedDebts  = customerDebts.filter(d => d.approvalStatus === 'disputed');

  score -= overdueDebts.length * 10;
  score -= partialDebts.length * 3;
  score -= disputedDebts.length * 8;

  // Early payment bonus
  customerDebts.forEach(d => {
    if (d.status === 'settled' && d.paidAt && d.dueDate) {
      if (d.paidAt.toMillis() < d.dueDate.toMillis()) {
        score += 5;
      }
    }
  });

  // Penalty for chronic overdue behaviour
  if (overdueDebts.length > 3) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function trustScoreLabel(score: number): 'excellent' | 'good' | 'average' | 'high_risk' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'average';
  return 'high_risk';
}

export function trustScoreColor(score: number): string {
  if (score >= 90) return '#20D6C7';
  if (score >= 70) return '#0FB8A9';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

// ─── Risk Classification ───────────────────────────────────────────────────────

export function classifyRisk(
  trustScore: number,
  outstanding: number,
  overdueCount: number,
): RiskLevel {
  if (trustScore < 50 || overdueCount > 3 || outstanding > 5000) return 'high';
  if (trustScore < 70 || overdueCount > 1 || outstanding > 2000) return 'medium';
  return 'low';
}

export function suggestAction(
  riskLevel: RiskLevel,
  overdueCount: number,
  trustScore: number,
): CustomerRiskProfile['suggestedAction'] {
  if (riskLevel === 'high' || overdueCount > 3) return 'urgent';
  if (trustScore < 60)   return 'reduce_credit';
  if (riskLevel === 'medium' || overdueCount > 0) return 'remind';
  return 'safe';
}

// ─── Customer Risk Profiles ────────────────────────────────────────────────────

export function buildCustomerRiskProfiles(
  customers: CustomerDoc[],
  debts: DebtDoc[],
): CustomerRiskProfile[] {
  return customers.map(customer => {
    const customerDebts = debts.filter(d => d.customerId === customer.id);
    const trustScore    = computeCustomerTrustScore(customerDebts);
    const outstanding   = customerDebts
      .filter(d => d.status !== 'settled' && d.status !== 'rejected')
      .reduce((s, d) => s + d.remainingAmount, 0);
    const overdueCount  = customerDebts.filter(d => d.status === 'overdue').length;
    const riskLevel     = classifyRisk(trustScore, outstanding, overdueCount);
    const suggestedAction = suggestAction(riskLevel, overdueCount, trustScore);

    return { customer, trustScore, outstanding, overdueCount, riskLevel, suggestedAction };
  }).sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.trustScore - b.trustScore;
  });
}

// ─── Smart Insights ────────────────────────────────────────────────────────────

export function generateSmartInsights(
  debts: DebtDoc[],
  customers: CustomerDoc[],
  _payments: PaymentDoc[], // reserved for future ML pattern analysis
  lang: string = 'en',
): SmartInsight[] {
  const ar = lang === 'ar';
  const now    = Date.now();
  const in7    = now + 7  * 86_400_000;
  const in30   = now + 30 * 86_400_000;

  const activeDebts   = debts.filter(d => d.status !== 'settled' && d.status !== 'rejected');
  const overdueDebts  = debts.filter(d => d.status === 'overdue');
  const settledDebts  = debts.filter(d => d.status === 'settled');
  const pendingDebts  = debts.filter(d => d.approvalStatus === 'pending');
  const disputedDebts = debts.filter(d => d.approvalStatus === 'disputed');

  const overdueAmount   = overdueDebts.reduce((s, d) => s + d.remainingAmount, 0);
  const next7Expected   = activeDebts
    .filter(d => d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in7)
    .reduce((s, d) => s + d.remainingAmount, 0);
  const next30Expected  = activeDebts
    .filter(d => d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in30)
    .reduce((s, d) => s + d.remainingAmount, 0);

  // Collection rate (this month vs last month approximation)
  const thisMonthStart = startOfMonth(new Date()).getTime();
  const lastMonthStart = startOfMonth(subDays(new Date(), 30)).getTime();
  const thisMonthCollected = settledDebts
    .filter(d => d.paidAt && d.paidAt.toMillis() >= thisMonthStart)
    .reduce((s, d) => s + d.amount, 0);
  const lastMonthCollected = settledDebts
    .filter(d => d.paidAt && d.paidAt.toMillis() >= lastMonthStart && d.paidAt.toMillis() < thisMonthStart)
    .reduce((s, d) => s + d.amount, 0);
  const collectionDelta = lastMonthCollected > 0
    ? Math.round(((thisMonthCollected - lastMonthCollected) / lastMonthCollected) * 100) : null;

  const highRiskCustomers = customers.filter(c => c.trustScore < 50).length;
  const excellentCustomers = customers.filter(c => c.trustScore >= 90).length;

  const insights: SmartInsight[] = [];

  // Overdue
  if (overdueDebts.length > 0) {
    const uniqueOverdue = new Set(overdueDebts.map(d => d.customerId)).size;
    insights.push({
      id: 'overdue',
      type: 'danger',
      priority: 1,
      title: ar
        ? `${uniqueOverdue} ${uniqueOverdue > 1 ? 'عملاء لديهم' : 'عميل لديه'} ديون متأخرة`
        : `${uniqueOverdue} customer${uniqueOverdue > 1 ? 's have' : ' has'} overdue debts`,
      body: ar
        ? `إجمالي المتأخرات: ${overdueAmount.toLocaleString()} ريال. أرسل تذكيرات الدفع الآن.`
        : `Total overdue: SAR ${overdueAmount.toLocaleString()}. Send payment reminders now.`,
    });
  }

  // Collection delta
  if (collectionDelta !== null && Math.abs(collectionDelta) >= 5) {
    insights.push({
      id: 'collection_delta',
      type: collectionDelta >= 0 ? 'success' : 'warning',
      priority: 2,
      title: ar
        ? (collectionDelta >= 0
            ? `تحسّن معدل التحصيل بنسبة ${collectionDelta}% هذا الشهر`
            : `انخفض معدل التحصيل بنسبة ${Math.abs(collectionDelta)}% هذا الشهر`)
        : (collectionDelta >= 0
            ? `Collection rate improved by ${collectionDelta}% this month`
            : `Collection rate dropped by ${Math.abs(collectionDelta)}% this month`),
      body: ar
        ? (collectionDelta >= 0
            ? `${thisMonthCollected.toLocaleString()} ريال تم تحصيلها حتى الآن هذا الشهر.`
            : `فكّر في زيادة تواتر المتابعة.`)
        : (collectionDelta >= 0
            ? `SAR ${thisMonthCollected.toLocaleString()} collected so far this month.`
            : `Consider increasing follow-up frequency.`),
    });
  }

  // Next 7 days cash inflow
  if (next7Expected > 0) {
    insights.push({
      id: 'cashflow_7',
      type: 'info',
      priority: 3,
      title: ar ? 'التدفق النقدي المتوقع — الـ 7 أيام القادمة' : 'Expected cash inflow — next 7 days',
      body: ar
        ? `${next7Expected.toLocaleString()} ريال مستحقة من ${activeDebts.filter(d => d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in7).length} عملاء.`
        : `SAR ${next7Expected.toLocaleString()} due from ${activeDebts.filter(d => d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in7).length} customers.`,
    });
  }

  // Pending approvals
  if (pendingDebts.length > 0) {
    insights.push({
      id: 'pending',
      type: 'warning',
      priority: 4,
      title: ar
        ? `${pendingDebts.length} ${pendingDebts.length > 1 ? 'حسابات تنتظر' : 'حساب ينتظر'} موافقة العميل`
        : `${pendingDebts.length} tab${pendingDebts.length > 1 ? 's' : ''} awaiting customer approval`,
      body: ar
        ? 'ذكّر العملاء بالموافقة على حساباتهم لتفعيلها.'
        : 'Remind customers to approve their tabs to activate them.',
    });
  }

  // Disputed
  if (disputedDebts.length > 0) {
    insights.push({
      id: 'disputed',
      type: 'danger',
      priority: 5,
      title: ar
        ? `${disputedDebts.length} ${disputedDebts.length > 1 ? 'ديون متنازع عليها تحتاج' : 'دين متنازع عليه يحتاج'} إلى اهتمام`
        : `${disputedDebts.length} disputed debt${disputedDebts.length > 1 ? 's' : ''} require attention`,
      body: ar
        ? 'راجع الحسابات المتنازع عليها وتواصل مع العملاء لحل الخلافات.'
        : 'Review disputed tabs and contact customers to resolve disagreements.',
    });
  }

  // High-risk customers
  if (highRiskCustomers > 0) {
    insights.push({
      id: 'high_risk',
      type: 'warning',
      priority: 6,
      title: ar
        ? `${highRiskCustomers} ${highRiskCustomers > 1 ? 'عملاء عالية' : 'عميل عالي'} المخاطر`
        : `${highRiskCustomers} high-risk customer${highRiskCustomers > 1 ? 's' : ''}`,
      body: ar
        ? 'فكّر في تقليل حدود الائتمان أو طلب سداد أبكر لهذه الحسابات.'
        : 'Consider reducing credit limits or requiring earlier payment for these accounts.',
    });
  }

  // Excellent customers
  if (excellentCustomers > 0 && overdueDebts.length === 0) {
    insights.push({
      id: 'excellent',
      type: 'success',
      priority: 7,
      title: ar
        ? `${excellentCustomers} ${excellentCustomers > 1 ? 'عملاء لديهم' : 'عميل لديه'} درجة ثقة ممتازة`
        : `${excellentCustomers} customer${excellentCustomers > 1 ? 's have' : ' has'} Excellent Trust Score`,
      body: ar
        ? 'هؤلاء العملاء يدفعون بانتظام — فكّر في منحهم حدوداً ائتمانية أعلى.'
        : 'These accounts are reliable payers — consider offering them higher credit limits.',
    });
  }

  // 30-day forecast
  if (next30Expected > 0) {
    insights.push({
      id: 'cashflow_30',
      type: 'info',
      priority: 8,
      title: ar ? 'توقعات الـ 30 يومًا القادمة' : 'Next 30 days forecast',
      body: ar
        ? `${next30Expected.toLocaleString()} ريال متوقعة عبر الحسابات النشطة.`
        : `SAR ${next30Expected.toLocaleString()} expected across active tabs.`,
    });
  }

  // All on track
  if (overdueDebts.length === 0 && activeDebts.length > 0) {
    insights.push({
      id: 'on_track',
      type: 'success',
      priority: 9,
      title: ar ? 'جميع الحسابات النشطة على المسار الصحيح' : 'All active tabs are on track',
      body: ar
        ? `${activeDebts.length} حساب نشط بدون أي حسابات متأخرة.`
        : `${activeDebts.length} active tab${activeDebts.length > 1 ? 's' : ''} with no overdue accounts.`,
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

// ─── Cash Flow Forecast ────────────────────────────────────────────────────────

export function buildCashFlowForecast(debts: DebtDoc[]): CashFlowForecast {
  const now  = new Date();
  const nowMs = now.getTime();
  const active = debts.filter(d => d.status !== 'settled' && d.status !== 'rejected');

  const next7Total  = active
    .filter(d => d.dueDate && d.dueDate.toMillis() > nowMs && d.dueDate.toMillis() <= nowMs + 7 * 86_400_000)
    .reduce((s, d) => s + d.remainingAmount, 0);
  const next30Total = active
    .filter(d => d.dueDate && d.dueDate.toMillis() > nowMs && d.dueDate.toMillis() <= nowMs + 30 * 86_400_000)
    .reduce((s, d) => s + d.remainingAmount, 0);

  // 4-week weekly forecast
  const weekly = Array.from({ length: 4 }, (_, i) => {
    const start = addDays(now, i * 7);
    const end   = addDays(now, (i + 1) * 7);
    return {
      label: `Wk ${i + 1}`,
      amount: active
        .filter(d => d.dueDate && d.dueDate.toDate() >= start && d.dueDate.toDate() < end)
        .reduce((s, d) => s + d.remainingAmount, 0),
    };
  });

  // 3-month monthly forecast (include settled for this month trends)
  const monthly = Array.from({ length: 3 }, (_, i) => {
    const base = new Date(now);
    base.setDate(1);
    base.setMonth(base.getMonth() + i);
    const mStart = startOfMonth(base);
    const mEnd   = endOfMonth(base);
    return {
      label: format(mStart, 'MMM'),
      amount: active
        .filter(d => d.dueDate && d.dueDate.toDate() >= mStart && d.dueDate.toDate() <= mEnd)
        .reduce((s, d) => s + d.remainingAmount, 0),
    };
  });

  return { next7Total, next30Total, weekly, monthly };
}

// ─── Collection Performance ────────────────────────────────────────────────────

export function buildCollectionMetrics(
  debts: DebtDoc[],
  payments: PaymentDoc[],
): CollectionMetrics {
  const settled = debts.filter(d => d.status === 'settled');
  const active  = debts.filter(d => d.status !== 'settled' && d.status !== 'rejected');

  // Average payment delay (days between dueDate and paidAt)
  let totalDelayDays = 0;
  let delayCount     = 0;
  settled.forEach(d => {
    if (d.paidAt && d.dueDate) {
      const delay = (d.paidAt.toMillis() - d.dueDate.toMillis()) / 86_400_000;
      if (delay > 0) { totalDelayDays += delay; delayCount++; }
    }
  });
  const avgPaymentDelayDays = delayCount > 0 ? Math.round(totalDelayDays / delayCount) : 0;

  const paidTotal    = settled.reduce((s, d) => s + d.amount, 0);
  const unpaidTotal  = active.filter(d => d.paymentStatus !== 'partial').reduce((s, d) => s + d.remainingAmount, 0);
  const partialTotal = active.filter(d => d.paymentStatus === 'partial').reduce((s, d) => s + d.remainingAmount, 0);

  // Monthly recovery (last 6 months of payments)
  const now = new Date();
  const monthlyRecovery = Array.from({ length: 6 }, (_, i) => {
    const base = new Date(now);
    base.setDate(1);
    base.setMonth(base.getMonth() - (5 - i));
    const mStart = startOfMonth(base).getTime();
    const mEnd   = endOfMonth(base).getTime();
    return {
      label: format(base, 'MMM'),
      amount: payments
        .filter(p => p.createdAt.toMillis() >= mStart && p.createdAt.toMillis() <= mEnd)
        .reduce((s, p) => s + p.amount, 0),
    };
  });

  const totalIssuedWithPaid = paidTotal + unpaidTotal + partialTotal;
  const collectionRate = totalIssuedWithPaid > 0
    ? Math.round((paidTotal / totalIssuedWithPaid) * 100) : 0;

  return { collectionRate, avgPaymentDelayDays, paidTotal, unpaidTotal, partialTotal, monthlyRecovery };
}

// ─── Smart Reminders ──────────────────────────────────────────────────────────

export function generateSmartReminders(
  debts: DebtDoc[],
  customers: CustomerDoc[],
  lang: string = 'en',
): SmartReminder[] {
  const ar = lang === 'ar';
  const now     = Date.now();
  const in1Day  = now + 86_400_000;
  const in3Days = now + 3 * 86_400_000;
  const reminders: SmartReminder[] = [];

  debts.forEach(d => {
    if (d.status === 'settled' || d.status === 'rejected') return;
    const customer = customers.find(c => c.id === d.customerId);
    const name = customer?.fullName ?? d.customerName;

    if (d.status === 'overdue') {
      const daysOverdue = d.dueDate
        ? Math.round((now - d.dueDate.toMillis()) / 86_400_000)
        : 0;
      // Chronic late payers
      const customerDebts = debts.filter(x => x.customerId === d.customerId && x.status === 'settled');
      const usuallyLate   = customerDebts.filter(x => x.paidAt && x.dueDate && x.paidAt.toMillis() > x.dueDate.toMillis()).length;
      const isChronicLate = customerDebts.length > 0 && usuallyLate / customerDebts.length > 0.5;

      reminders.push({
        customerId:   d.customerId,
        customerName: name,
        urgency:      daysOverdue > 7 ? 'high' : 'medium',
        daysOverdue,
        message: ar
          ? (isChronicLate
              ? `${name} عادةً ما يتأخر في السداد — تابع معه اليوم.`
              : `تابع مع ${name}: ${d.remainingAmount.toLocaleString()} ريال متأخرة بـ ${daysOverdue} ${daysOverdue > 1 ? 'أيام' : 'يوم'}.`)
          : (isChronicLate
              ? `${name} usually pays ${Math.round(usuallyLate / customerDebts.length * 3)} days late — follow up today.`
              : `Follow up with ${name}: SAR ${d.remainingAmount.toLocaleString()} is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue.`),
      });
    } else if (d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in1Day) {
      reminders.push({
        customerId:   d.customerId,
        customerName: name,
        urgency:      'medium',
        message: ar
            ? `أرسل تذكيراً لـ ${name}: ${d.remainingAmount.toLocaleString()} ريال مستحقة غداً.`
            : `Send reminder to ${name}: SAR ${d.remainingAmount.toLocaleString()} due tomorrow.`,
      });
    } else if (d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in3Days) {
      reminders.push({
        customerId:   d.customerId,
        customerName: name,
        urgency:      'low',
        message: ar
            ? `قادم: ${name} مدين بـ ${d.remainingAmount.toLocaleString()} ريال خلال 3 أيام.`
            : `Upcoming: ${name} owes SAR ${d.remainingAmount.toLocaleString()} due in 3 days.`,
      });
    }
  });

  // De-duplicate by customerId (keep highest urgency)
  const seen = new Map<string, SmartReminder>();
  reminders.forEach(r => {
    const existing = seen.get(r.customerId);
    if (!existing || urgencyRank(r.urgency) > urgencyRank(existing.urgency)) {
      seen.set(r.customerId, r);
    }
  });

  return [...seen.values()].sort((a, b) => urgencyRank(b.urgency) - urgencyRank(a.urgency));
}

function urgencyRank(u: SmartReminder['urgency']): number {
  return u === 'high' ? 3 : u === 'medium' ? 2 : 1;
}

// ─── Credit Insights ──────────────────────────────────────────────────────────

export function buildCreditInsights(
  customers: CustomerDoc[],
  debts: DebtDoc[],
): CreditInsights {
  const overdueCountMap = new Map<string, number>();
  debts.filter(d => d.status === 'overdue').forEach(d => {
    overdueCountMap.set(d.customerId, (overdueCountMap.get(d.customerId) ?? 0) + 1);
  });

  return {
    topPaying:          [...customers].sort((a, b) => b.totalPaid - a.totalPaid).slice(0, 5),
    mostDelayed:        [...customers].sort((a, b) =>
      (overdueCountMap.get(b.id) ?? 0) - (overdueCountMap.get(a.id) ?? 0)).slice(0, 5),
    highestOutstanding: [...customers].sort((a, b) => b.totalDebt - a.totalDebt).slice(0, 5),
    fastestPaying:      [...customers]
      .filter(c => c.trustScore >= 70)
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 5),
    newestCustomers:    [...customers]
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 5),
  };
}
