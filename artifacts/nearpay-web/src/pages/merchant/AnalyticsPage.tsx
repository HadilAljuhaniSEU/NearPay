import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Users, BarChart3, Award, Wallet } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';
import { useCustomers } from '../../hooks/useCustomers';
import { useMerchantPayments } from '../../hooks/usePayments';
import { useT } from '../../contexts/LanguageContext';
import { DebtDoc, PaymentDoc, CustomerDoc } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/** Returns last 7 day-strings in 'yyyy-MM-dd' format (oldest first) */
function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  );
}

/** Returns last 6 month-strings in 'yyyy-MM' format (oldest first) */
function last6Months(): string[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return format(d, 'yyyy-MM');
  });
}

type ChartPoint = { label: string; debts: number; payments: number };

function buildChartData(
  debts: DebtDoc[],
  payments: PaymentDoc[],
  period: 0 | 1 | 2
): ChartPoint[] {
  if (period === 0) {
    // Week: last 7 days
    return last7Days().map(dayStr => ({
      label: format(new Date(dayStr), 'EEE'),
      debts:    debts.filter(d => format(d.createdAt.toDate(), 'yyyy-MM-dd') === dayStr).reduce((s, d) => s + d.amount, 0),
      payments: payments.filter(p => format(p.createdAt.toDate(), 'yyyy-MM-dd') === dayStr).reduce((s, p) => s + p.amount, 0),
    }));
  }
  if (period === 1) {
    // Month: 4 weeks back
    return Array.from({ length: 4 }, (_, i) => {
      const end = subDays(new Date(), (3 - i) * 7);
      const start = subDays(end, 6);
      return {
        label: `W${i + 1}`,
        debts:    debts.filter(d => { const t = d.createdAt.toDate(); return t >= start && t <= end; }).reduce((s, d) => s + d.amount, 0),
        payments: payments.filter(p => { const t = p.createdAt.toDate(); return t >= start && t <= end; }).reduce((s, p) => s + p.amount, 0),
      };
    });
  }
  // Quarter: last 6 months
  return last6Months().map(m => ({
    label:    format(new Date(m + '-02'), 'MMM'),
    debts:    debts.filter(d => format(d.createdAt.toDate(), 'yyyy-MM') === m).reduce((s, d) => s + d.amount, 0),
    payments: payments.filter(p => format(p.createdAt.toDate(), 'yyyy-MM') === m).reduce((s, p) => s + p.amount, 0),
  }));
}

/** Overdue count grouped by same periods as buildChartData */
function buildOverdueCounts(debts: DebtDoc[], period: 0 | 1 | 2): { label: string; count: number }[] {
  if (period === 0) {
    return last7Days().map(dayStr => ({
      label: format(new Date(dayStr), 'EEE'),
      count: debts.filter(d => d.status === 'overdue' && d.dueDate && format(d.dueDate.toDate(), 'yyyy-MM-dd') === dayStr).length,
    }));
  }
  if (period === 1) {
    return Array.from({ length: 4 }, (_, i) => {
      const end = subDays(new Date(), (3 - i) * 7);
      const start = subDays(end, 6);
      return {
        label: `W${i + 1}`,
        count: debts.filter(d => d.status === 'overdue' && d.dueDate && d.dueDate.toDate() >= start && d.dueDate.toDate() <= end).length,
      };
    });
  }
  return last6Months().map(m => ({
    label: format(new Date(m + '-02'), 'MMM'),
    count: debts.filter(d => d.status === 'overdue' && d.dueDate && format(d.dueDate.toDate(), 'yyyy-MM') === m).length,
  }));
}

/** Expected cash flow for next 4 weeks */
function buildCashFlow(debts: DebtDoc[]): { label: string; amount: number }[] {
  const now = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return {
      label: `Wk ${i + 1}`,
      amount: debts
        .filter(d => d.status !== 'settled' && d.status !== 'rejected' && d.dueDate &&
          d.dueDate.toDate() >= weekStart && d.dueDate.toDate() < weekEnd)
        .reduce((s, d) => s + d.remainingAmount, 0),
    };
  });
}

// ─── Bar component ────────────────────────────────────────────────────────────

function Bar({ value, max, color, label, height = 120 }: {
  value: number; max: number; color: string; label: string; height?: number;
}) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 4;
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      {value > 0 && <span className="text-[9px] font-bold text-muted-foreground">{value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}</span>}
      {value === 0 && <span className="text-[9px] font-bold opacity-0">—</span>}
      <div className="w-full relative" style={{ height }}>
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-lg"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.5, type: 'spring', delay: 0.1 }}
        />
      </div>
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{label}</span>
    </div>
  );
}

function DualBar({ point, maxVal, debtColor, payColor, height = 120 }: {
  point: ChartPoint; maxVal: number; debtColor: string; payColor: string; height?: number;
}) {
  const debtPct = maxVal > 0 ? Math.max(4, (point.debts / maxVal) * 100) : 4;
  const payPct  = maxVal > 0 ? Math.max(4, (point.payments / maxVal) * 100) : 4;
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <div className="w-full flex gap-0.5 items-end" style={{ height }}>
        <motion.div className="flex-1 rounded-lg" style={{ background: debtColor }}
          initial={{ height: 0 }} animate={{ height: `${debtPct}%` }}
          transition={{ duration: 0.5, type: 'spring', delay: 0.1 }} />
        <motion.div className="flex-1 rounded-lg" style={{ background: payColor }}
          initial={{ height: 0 }} animate={{ height: `${payPct}%` }}
          transition={{ duration: 0.5, type: 'spring', delay: 0.17 }} />
      </div>
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{point.label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { merchant } = useAuthContext();
  const { debts, loading: debtsLoading } = useDebts(merchant?.id ?? null);
  const { customers }  = useCustomers(merchant?.id ?? null);
  const { payments }   = useMerchantPayments(merchant?.id ?? null);
  const t = useT();
  const [period, setPeriod] = useState<0 | 1 | 2>(0);

  const periodKeys = ['period_week', 'period_month', 'period_quarter'] as const;

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalCollected   = merchant?.totalCollected   ?? 0;
  const totalOutstanding = merchant?.totalOutstanding ?? 0;
  const collectionRate   = (totalCollected + totalOutstanding) > 0
    ? Math.round(totalCollected / (totalCollected + totalOutstanding) * 100) : 0;
  const overdueAmount    = useMemo(() => debts.filter(d => d.status === 'overdue').reduce((s, d) => s + d.remainingAmount, 0), [debts]);
  const overdueCount     = useMemo(() => debts.filter(d => d.status === 'overdue').length, [debts]);
  const settledCount     = useMemo(() => debts.filter(d => d.status === 'settled').length, [debts]);
  const pendingCount     = useMemo(() => debts.filter(d => d.approvalStatus === 'pending').length, [debts]);
  const avgDebt          = debts.length > 0 ? Math.round(debts.reduce((s, d) => s + d.amount, 0) / debts.length) : 0;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const chartData     = useMemo(() => buildChartData(debts, payments, period), [debts, payments, period]);
  const overdueData   = useMemo(() => buildOverdueCounts(debts, period), [debts, period]);
  const cashFlowData  = useMemo(() => buildCashFlow(debts), [debts]);
  const maxDualVal    = useMemo(() => Math.max(...chartData.flatMap(c => [c.debts, c.payments]), 1), [chartData]);
  const maxOverdue    = useMemo(() => Math.max(...overdueData.map(o => o.count), 1), [overdueData]);
  const maxCashFlow   = useMemo(() => Math.max(...cashFlowData.map(c => c.amount), 1), [cashFlowData]);

  // ── Customer distribution ──────────────────────────────────────────────────
  const distribution = useMemo(() => [
    { label: t('trust_excellent'), count: customers.filter(c => c.trustScore >= 90).length, color: '#2ED8C3' },
    { label: t('trust_good'),      count: customers.filter(c => c.trustScore >= 70 && c.trustScore < 90).length, color: '#19B8D3' },
    { label: t('trust_average'),   count: customers.filter(c => c.trustScore >= 50 && c.trustScore < 70).length, color: '#F59E0B' },
    { label: t('risk_high'),       count: customers.filter(c => c.trustScore < 50).length,  color: '#EF4444' },
  ], [customers]);
  const totalCustomers = customers.length;

  // ── Top debtors ────────────────────────────────────────────────────────────
  const topDebtors = useMemo(() =>
    [...customers].sort((a, b) => b.totalDebt - a.totalDebt).slice(0, 5),
    [customers]);

  const cardCls = "bg-card border border-border/60 rounded-[22px] shadow-sm";

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('analytics_title')} />

      <div className="page-scroll px-5 py-4 space-y-5">

        {/* Period Selector */}
        <div className="flex gap-2">
          {periodKeys.map((pk, i) => (
            <button key={pk} onClick={() => setPeriod(i as 0|1|2)}
              className={`flex-1 py-2.5 rounded-[14px] text-xs font-bold transition-all border ${
                i === period
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
              }`}>
              {t(pk)}
            </button>
          ))}
        </div>

        {/* ── Summary KPIs ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 4px 16px rgba(11,35,65,0.2)' }}>
            <div className="absolute top-0 end-0 w-20 h-20 rounded-full blur-xl -me-6 -mt-6 pointer-events-none"
                 style={{ background: 'rgba(46,216,195,0.2)' }} />
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1.5">{t('collected')}</p>
            <p className="text-lg font-bold text-white">{t('sar')} {totalCollected.toLocaleString()}</p>
            {collectionRate > 0 && (
              <div className="flex items-center gap-1 mt-2.5 w-fit px-2 py-0.5 rounded-md" style={{ background: 'rgba(46,216,195,0.2)' }}>
                <TrendingUp size={11} style={{ color: '#2ED8C3' }} />
                <span className="text-[10px] font-bold" style={{ color: '#2ED8C3' }}>{collectionRate}%</span>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className={`${cardCls} p-5`}>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">{t('overdue_amount')}</p>
            <p className="text-lg font-bold text-destructive">{t('sar')} {overdueAmount.toLocaleString()}</p>
            {overdueCount > 0 && (
              <div className="flex items-center gap-1 mt-2.5 bg-destructive/8 w-fit px-2 py-0.5 rounded-md">
                <TrendingDown size={11} className="text-destructive" />
                <span className="text-[10px] font-bold text-destructive">{overdueCount} {t('accounts')}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Business Performance ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
          className={`${cardCls} p-5`}>
          <h3 className="text-sm font-bold mb-4">{t('business_performance')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{settledCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{t('settled_count')}</p>
            </div>
            <div className="text-center border-x border-border/60">
              <p className="text-xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{t('pending_approval')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{t('sar')} {avgDebt.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{t('avg_debt')}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Collection Rate ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
          className={`${cardCls} p-5 flex flex-col gap-3`}>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold">{t('collection_rate')}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t('collection_rate_sub')}</p>
            </div>
            <p className="text-3xl font-black tracking-tight text-foreground">{collectionRate}%</p>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${collectionRate}%` }}
              transition={{ delay: 0.3, duration: 0.9, type: 'spring' }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #2ED8C3 0%, #19B8D3 100%)' }}
            />
          </div>
        </motion.div>

        {/* ── Dual Bar Chart: Debts vs Payments ────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
          className={`${cardCls} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold">{t('chart_monthly_debts')}</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#0B2341' }} />{t('kpi_total_debts')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#2ED8C3' }} />{t('chart_monthly_payments')}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {period === 0 ? t('period_week') : period === 1 ? t('period_month') : t('period_quarter')} · SAR
          </p>
          {debtsLoading ? (
            <div className="h-32 flex items-end gap-2">
              {[1,2,3,4,5,6,7].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${30+i*8}%` }} />)}
            </div>
          ) : (
            <div className="flex items-end gap-2" style={{ height: 128 }}>
              {chartData.map((p, i) => (
                <DualBar key={i} point={p} maxVal={maxDualVal}
                  debtColor="rgba(11,35,65,0.5)" payColor="#2ED8C3" height={128} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Overdue Trend ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className={`${cardCls} p-5`}>
          <h3 className="text-sm font-bold mb-4">{t('chart_overdue_trend')}</h3>
          {debtsLoading ? (
            <div className="h-24 flex items-end gap-2">
              {[1,2,3,4,5,6,7].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${20+i*6}%` }} />)}
            </div>
          ) : (
            <div className="flex items-end gap-2" style={{ height: 96 }}>
              {overdueData.map((d, i) => (
                <Bar key={i} value={d.count} max={maxOverdue} color="#EF4444" label={d.label} height={96} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Expected Cash Flow ────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`${cardCls} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">{t('chart_cashflow')}</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              <Calendar size={11} /> {t('next_30_days')}
            </div>
          </div>
          {debtsLoading ? (
            <div className="h-24 flex items-end gap-3">
              {[1,2,3,4].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${25+i*10}%` }} />)}
            </div>
          ) : (
            <div className="flex items-end gap-3" style={{ height: 96 }}>
              {cashFlowData.map((d, i) => (
                <Bar key={i} value={d.amount} max={maxCashFlow} color="#10B981" label={d.label} height={96} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Customer Distribution ─────────────────────────────────────────── */}
        {customers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
            className={`${cardCls} p-5`}>
            <h3 className="text-sm font-bold mb-4">{t('chart_distribution')}</h3>
            <div className="space-y-3">
              {distribution.map(tier => (
                <div key={tier.label}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="font-bold text-foreground">{tier.label}</span>
                    <span className="text-muted-foreground">{tier.count} / {totalCustomers}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: tier.color }}
                      initial={{ width: 0 }}
                      animate={{ width: totalCustomers > 0 ? `${(tier.count / totalCustomers) * 100}%` : '0%' }}
                      transition={{ duration: 0.7, type: 'spring' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Top Debtors ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}
          className={`${cardCls} overflow-hidden`}>
          <div className="px-5 py-4 border-b border-border/60 bg-secondary/20">
            <h3 className="text-sm font-bold">{t('top_debtors')}</h3>
          </div>
          {topDebtors.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">{t('no_data_chart')}</div>
          ) : (
            <div className="p-2">
              {topDebtors.map((c, i) => {
                const trustColor = c.trustScore >= 90 ? '#2ED8C3' : c.trustScore >= 70 ? '#19B8D3' : c.trustScore >= 50 ? '#F59E0B' : '#EF4444';
                return (
                  <div key={c.id} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                         style={i === 0 ? { background: 'linear-gradient(135deg, #2ED8C3, #19B8D3)', color: '#0B2341' }
                                : i === 1 ? { background: 'rgba(46,216,195,0.2)', color: '#2ED8C3' }
                                : { background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                      {i + 1}
                    </div>
                    <Avatar className="h-9 w-9 border border-border/60">
                      <AvatarFallback className="bg-primary/8 text-primary font-bold text-xs">{getInitials(c.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{c.fullName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Award size={10} style={{ color: trustColor }} />
                        <span className="text-[10px] font-bold" style={{ color: trustColor }}>{c.trustScore}/100</span>
                      </div>
                    </div>
                    <p className={`text-sm font-bold flex-shrink-0 ${c.trustScore < 50 ? 'text-destructive' : 'text-foreground'}`}>
                      {t('sar')} {c.totalDebt.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
