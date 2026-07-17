/**
 * AI & Financial Intelligence Dashboard
 *
 * All insights are generated locally from Firestore data — no external AI APIs.
 * TODO: Replace rule-based scoring with ML model endpoints when data volume allows.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingUp, TrendingDown, Shield, Wallet, Users, Bell,
  AlertTriangle, CheckCircle2, Info, Zap, ChevronRight, Star,
  Clock, CreditCard, UserCheck, UserX, Flame, ArrowUpRight,
} from 'lucide-react';
import { StatusBar }        from '../../components/StatusBar';
import { BottomNav }        from '../../components/BottomNav';
import { PageHeader }       from '../../components/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext }   from '../../contexts/AuthContext';
import { useDebts }         from '../../hooks/useDebts';
import { useCustomers }     from '../../hooks/useCustomers';
import { useMerchantPayments } from '../../hooks/usePayments';
import { useT }             from '../../contexts/LanguageContext';
import {
  computeCustomerTrustScore,
  trustScoreLabel,
  trustScoreColor,
  buildCustomerRiskProfiles,
  generateSmartInsights,
  buildCashFlowForecast,
  buildCollectionMetrics,
  generateSmartReminders,
  buildCreditInsights,
  CustomerRiskProfile,
} from '../../services/insightsService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Circular progress indicator ─────────────────────────────────────────────

function CircularScore({ score, size = 56 }: { score: number; size?: number }) {
  const r   = (size - 6) / 2;
  const c   = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const color = trustScoreColor(pct);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5}
              className="stroke-secondary" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5}
        stroke={color} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ duration: 0.8, type: 'spring' }}
      />
    </svg>
  );
}

// ─── Bar component (same pattern as AnalyticsPage) ───────────────────────────

function Bar({ value, max, color, label, height = 96 }: {
  value: number; max: number; color: string; label: string; height?: number;
}) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 4;
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      {value > 0
        ? <span className="text-[9px] font-bold text-muted-foreground">{value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}</span>
        : <span className="text-[9px] opacity-0">—</span>}
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

// ─── Risk badge ───────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { label: 'Low Risk',    bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    medium: { label: 'Medium Risk', bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400' },
    high:   { label: 'High Risk',   bg: 'bg-destructive/10', text: 'text-destructive' },
  }[level];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

// ─── Action suggestion label ──────────────────────────────────────────────────

function ActionLabel({ action }: { action: CustomerRiskProfile['suggestedAction'] }) {
  const cfg = {
    safe:         { label: 'Safe Customer',     color: 'text-emerald-500' },
    remind:       { label: 'Send Reminder',     color: 'text-amber-500'   },
    reduce_credit:{ label: 'Reduce Credit',     color: 'text-orange-500'  },
    urgent:       { label: 'Urgent Follow-up',  color: 'text-destructive' },
  }[action];
  return <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>;
}

// ─── Insight card ─────────────────────────────────────────────────────────────

const INSIGHT_ICON = {
  success: CheckCircle2,
  info:    Info,
  warning: AlertTriangle,
  danger:  Flame,
};
const INSIGHT_COLOR = {
  success: { icon: '#2ED8C3', bg: 'rgba(46,216,195,0.1)',  border: 'rgba(46,216,195,0.2)' },
  info:    { icon: '#19B8D3', bg: 'rgba(25,184,211,0.1)',  border: 'rgba(25,184,211,0.2)' },
  warning: { icon: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  danger:  { icon: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)'  },
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'health',   label: 'Financial Health', icon: Wallet   },
  { id: 'insights', label: 'Smart Insights',   icon: Brain    },
  { id: 'trust',    label: 'Trust Scores',     icon: Shield   },
  { id: 'cashflow', label: 'Cash Flow',        icon: TrendingUp },
  { id: 'risk',     label: 'Risk Analysis',    icon: AlertTriangle },
] as const;

type TabId = typeof TABS[number]['id'];

// ─── Stagger variants ─────────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIPage() {
  const { merchant }               = useAuthContext();
  const { debts, loading }         = useDebts(merchant?.id ?? null);
  const { customers }              = useCustomers(merchant?.id ?? null);
  const { payments }               = useMerchantPayments(merchant?.id ?? null);
  const t = useT();

  const [activeTab, setActiveTab] = useState<TabId>('health');

  // ── Computed analytics ────────────────────────────────────────────────────
  const insights    = useMemo(() => generateSmartInsights(debts, customers, payments), [debts, customers, payments]);
  const riskProfiles = useMemo(() => buildCustomerRiskProfiles(customers, debts), [customers, debts]);
  const cashFlow    = useMemo(() => buildCashFlowForecast(debts), [debts]);
  const metrics     = useMemo(() => buildCollectionMetrics(debts, payments), [debts, payments]);
  const reminders   = useMemo(() => generateSmartReminders(debts, customers), [debts, customers]);
  const creditIns   = useMemo(() => buildCreditInsights(customers, debts), [customers, debts]);

  // Customer-level trust scores
  const customerScores = useMemo(() =>
    customers.map(c => ({
      customer:   c,
      score:      computeCustomerTrustScore(debts.filter(d => d.customerId === c.id)),
    })).sort((a, b) => b.score - a.score),
    [customers, debts]);

  const maxCashWeekly = Math.max(...cashFlow.weekly.map(w => w.amount), 1);
  const maxMonthly    = Math.max(...cashFlow.monthly.map(m => m.amount), 1);
  const maxRecovery   = Math.max(...metrics.monthlyRecovery.map(m => m.amount), 1);

  const cardCls = 'bg-card border border-border/60 rounded-[22px] shadow-sm';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.06) 0%, transparent 70%)' }} />

      <PageHeader
        title="AI & Insights"
        subtitle="Financial Intelligence"
        action={
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold border"
               style={{ background: 'rgba(46,216,195,0.1)', color: '#2ED8C3', borderColor: 'rgba(46,216,195,0.25)' }}>
            <Zap size={11} />
            Live
          </div>
        }
      />

      {/* Tab bar */}
      <div className="px-4 pt-1 pb-3 bg-background/80 backdrop-blur-md z-30 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
          {TABS.map(tab => {
            const Icon    = tab.icon;
            const active  = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-xs font-bold transition-all border whitespace-nowrap ${
                  active
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4">
        <AnimatePresence mode="wait">
          {/* ── FINANCIAL HEALTH ───────────────────────────────────────────── */}
          {activeTab === 'health' && (
            <motion.div key="health" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-4 pt-2">

              {/* KPI grid */}
              <motion.div variants={item} className="grid grid-cols-2 gap-3">
                {/* Collection Rate */}
                <div className="rounded-[22px] p-5 relative overflow-hidden col-span-2"
                     style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 4px 16px rgba(11,35,65,0.18)' }}>
                  <div className="absolute top-0 end-0 w-24 h-24 rounded-full blur-xl -me-8 -mt-8 pointer-events-none"
                       style={{ background: 'rgba(46,216,195,0.25)' }} />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">{t('collection_rate')}</p>
                      <p className="text-3xl font-black text-white tracking-tight">{metrics.collectionRate}%</p>
                      <p className="text-[11px] text-white/50 font-medium mt-1">{t('collection_rate_sub')}</p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <CircularScore score={metrics.collectionRate} size={72} />
                      <span className="absolute text-base font-black text-white" style={{ rotate: '90deg' }}>
                        {/* hidden — shown by circle */}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
                    <motion.div className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2ED8C3, #19B8D3)' }}
                      initial={{ width: 0 }} animate={{ width: `${metrics.collectionRate}%` }}
                      transition={{ delay: 0.3, duration: 0.9, type: 'spring' }} />
                  </div>
                </div>

                {/* Paid total */}
                <div className={`${cardCls} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-500/10">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Paid</p>
                  </div>
                  <p className="text-lg font-black text-foreground">{t('sar')} {metrics.paidTotal.toLocaleString()}</p>
                </div>

                {/* Unpaid total */}
                <div className={`${cardCls} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-destructive/10">
                      <CreditCard size={13} className="text-destructive" />
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Unpaid</p>
                  </div>
                  <p className="text-lg font-black text-foreground">{t('sar')} {metrics.unpaidTotal.toLocaleString()}</p>
                </div>

                {/* Partial */}
                <div className={`${cardCls} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-500/10">
                      <Clock size={13} className="text-amber-500" />
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Partial</p>
                  </div>
                  <p className="text-lg font-black text-foreground">{t('sar')} {metrics.partialTotal.toLocaleString()}</p>
                </div>

                {/* Avg delay */}
                <div className={`${cardCls} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-primary/8">
                      <Clock size={13} className="text-primary" />
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Avg Delay</p>
                  </div>
                  <p className="text-lg font-black text-foreground">
                    {metrics.avgPaymentDelayDays > 0 ? `${metrics.avgPaymentDelayDays}d` : '—'}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-medium mt-0.5">avg days late</p>
                </div>
              </motion.div>

              {/* Monthly Recovery Chart */}
              <motion.div variants={item} className={`${cardCls} p-5`}>
                <h3 className="text-sm font-bold mb-1">Monthly Recovery</h3>
                <p className="text-xs text-muted-foreground mb-4">Payments collected per month · SAR</p>
                {loading ? (
                  <div className="h-24 flex items-end gap-2">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${20+i*8}%` }} />)}
                  </div>
                ) : (
                  <div className="flex items-end gap-2" style={{ height: 96 }}>
                    {metrics.monthlyRecovery.map((m, i) => (
                      <Bar key={i} value={m.amount} max={maxRecovery} color="#2ED8C3" label={m.label} height={96} />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Paid vs Unpaid donut-style */}
              <motion.div variants={item} className={`${cardCls} p-5`}>
                <h3 className="text-sm font-bold mb-4">Paid vs Outstanding</h3>
                {[
                  { label: 'Paid',    value: metrics.paidTotal,    color: '#2ED8C3' },
                  { label: 'Partial', value: metrics.partialTotal,  color: '#F59E0B' },
                  { label: 'Unpaid',  value: metrics.unpaidTotal,   color: '#EF4444' },
                ].map(row => {
                  const total = metrics.paidTotal + metrics.partialTotal + metrics.unpaidTotal;
                  const pct   = total > 0 ? Math.round((row.value / total) * 100) : 0;
                  return (
                    <div key={row.label} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="font-bold text-foreground">{row.label}</span>
                        <span className="text-muted-foreground">{pct}% · {t('sar')} {row.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: row.color }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, type: 'spring' }} />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Credit Insights */}
              <motion.div variants={item} className={`${cardCls} overflow-hidden`}>
                <div className="px-5 py-4 border-b border-border/50 bg-secondary/20">
                  <h3 className="text-sm font-bold">Merchant Credit Insights</h3>
                </div>
                {[
                  { title: 'Top Paying',          icon: Star,     color: '#2ED8C3', customers: creditIns.topPaying,          sub: (c: typeof creditIns.topPaying[0]) => `SAR ${c.totalPaid.toLocaleString()} paid` },
                  { title: 'Highest Outstanding',  icon: Wallet,   color: '#EF4444', customers: creditIns.highestOutstanding, sub: (c: typeof creditIns.topPaying[0]) => `SAR ${c.totalDebt.toLocaleString()} owed` },
                  { title: 'Fastest Paying',       icon: UserCheck,color: '#10B981', customers: creditIns.fastestPaying,      sub: (c: typeof creditIns.topPaying[0]) => `Trust ${c.trustScore}/100` },
                  { title: 'Newest Customers',     icon: Users,    color: '#6366F1', customers: creditIns.newestCustomers,    sub: (c: typeof creditIns.topPaying[0]) => `Joined ${c.createdAt ? c.createdAt.toDate().toLocaleDateString() : '—'}` },
                ].map((section, si) => (
                  <div key={si} className={si > 0 ? 'border-t border-border/40' : ''}>
                    <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                      <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{ background: `${section.color}18` }}>
                        <section.icon size={11} style={{ color: section.color }} />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{section.title}</p>
                    </div>
                    {section.customers.length === 0 ? (
                      <p className="px-5 pb-4 text-xs text-muted-foreground">No data yet</p>
                    ) : (
                      <div className="px-3 pb-3 space-y-1">
                        {section.customers.slice(0, 3).map((c, i) => (
                          <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-colors">
                            <span className="text-[11px] font-black text-muted-foreground/60 w-4">{i + 1}</span>
                            <Avatar className="h-7 w-7 border border-border/60">
                              <AvatarFallback className="bg-primary/8 text-primary font-bold text-[9px]">
                                {getInitials(c.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{c.fullName}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">{section.sub(c)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── SMART INSIGHTS ─────────────────────────────────────────────── */}
          {activeTab === 'insights' && (
            <motion.div key="insights" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-3 pt-2">
              {insights.length === 0 && (
                <motion.div variants={item} className={`${cardCls} p-8 text-center`}>
                  <Brain size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">No insights yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add customers and debts to generate intelligent recommendations.</p>
                </motion.div>
              )}
              {insights.map(ins => {
                const Icon  = INSIGHT_ICON[ins.type];
                const clr   = INSIGHT_COLOR[ins.type];
                return (
                  <motion.div key={ins.id} variants={item}
                    className="rounded-[22px] p-5 border"
                    style={{ background: clr.bg, borderColor: clr.border }}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-[14px] flex items-center justify-center flex-shrink-0 mt-0.5"
                           style={{ background: `${clr.icon}18`, border: `1px solid ${clr.icon}30` }}>
                        <Icon size={16} style={{ color: clr.icon }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground leading-snug">{ins.title}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">{ins.body}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Smart Reminders */}
              {reminders.length > 0 && (
                <motion.div variants={item} className={`${cardCls} overflow-hidden`}>
                  <div className="px-5 py-4 border-b border-border/50 bg-secondary/20 flex items-center gap-2">
                    <Bell size={14} className="text-amber-500" />
                    <h3 className="text-sm font-bold">Smart Reminders</h3>
                    <span className="ml-auto text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                      {reminders.length}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {reminders.slice(0, 5).map((r, i) => (
                      <div key={r.customerId + i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          r.urgency === 'high' ? 'bg-destructive' : r.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <p className="text-xs font-medium text-foreground leading-relaxed">{r.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── TRUST SCORE ANALYTICS ──────────────────────────────────────── */}
          {activeTab === 'trust' && (
            <motion.div key="trust" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-4 pt-2">

              {/* Distribution summary */}
              <motion.div variants={item} className={`${cardCls} p-5`}>
                <h3 className="text-sm font-bold mb-4">Trust Score Distribution</h3>
                {[
                  { label: 'Excellent (90–100)', color: '#2ED8C3', count: customerScores.filter(c => c.score >= 90).length },
                  { label: 'Good (70–89)',        color: '#19B8D3', count: customerScores.filter(c => c.score >= 70 && c.score < 90).length },
                  { label: 'Average (50–69)',     color: '#F59E0B', count: customerScores.filter(c => c.score >= 50 && c.score < 70).length },
                  { label: 'High Risk (<50)',     color: '#EF4444', count: customerScores.filter(c => c.score < 50).length },
                ].map(tier => (
                  <div key={tier.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="font-bold text-foreground">{tier.label}</span>
                      <span className="text-muted-foreground">{tier.count} / {customerScores.length}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: tier.color }}
                        initial={{ width: 0 }}
                        animate={{ width: customerScores.length > 0 ? `${(tier.count / customerScores.length) * 100}%` : '0%' }}
                        transition={{ duration: 0.7, type: 'spring' }} />
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Per-customer trust cards */}
              {customerScores.length === 0 ? (
                <motion.div variants={item} className={`${cardCls} p-8 text-center`}>
                  <Shield size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">No customers yet</p>
                </motion.div>
              ) : (
                <motion.div variants={container} className="space-y-3">
                  {customerScores.map(({ customer, score }) => {
                    const color  = trustScoreColor(score);
                    const badge  = trustScoreLabel(score);
                    const badgeLabelMap = {
                      excellent: 'Excellent',
                      good:      'Good',
                      average:   'Average',
                      high_risk: 'High Risk',
                    };
                    return (
                      <motion.div key={customer.id} variants={item}
                        className={`${cardCls} p-4 flex items-center gap-4`}>
                        {/* Circular score */}
                        <div className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center">
                          <CircularScore score={score} size={56} />
                          <span className="absolute text-sm font-black" style={{ color }}>
                            {score}
                          </span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{customer.fullName}</p>
                          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{customer.phone}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                  style={{ color, background: `${color}15`, borderColor: `${color}30` }}>
                              {badgeLabelMap[badge]}
                            </span>
                            {customer.totalDebt > 0 && (
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {t('sar')} {customer.totalDebt.toLocaleString()} owed
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Score pill */}
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-black" style={{ color }}>{score}</span>
                          <span className="text-[9px] text-muted-foreground font-medium">/100</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Algorithm note */}
              <motion.div variants={item} className="rounded-[16px] border border-border/40 bg-secondary/30 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Info size={10} /> How Trust Scores Work
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Starts at <strong>100</strong>. Penalties: late payment −10, partial payment −3, dispute −8, &gt;3 overdue −15. Bonus: early payment +5.
                  {/* TODO ML: replace with trained model */}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ── CASH FLOW FORECAST ─────────────────────────────────────────── */}
          {activeTab === 'cashflow' && (
            <motion.div key="cashflow" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-4 pt-2">

              {/* Summary tiles */}
              <motion.div variants={item} className="grid grid-cols-2 gap-3">
                <div className="rounded-[20px] p-4 border"
                     style={{ background: 'linear-gradient(135deg, rgba(46,216,195,0.12), rgba(25,184,211,0.08))', borderColor: 'rgba(46,216,195,0.25)' }}>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Next 7 Days</p>
                  <p className="text-lg font-black text-foreground">{t('sar')} {cashFlow.next7Total.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Expected inflow</p>
                </div>
                <div className={`${cardCls} p-4`}>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Next 30 Days</p>
                  <p className="text-lg font-black text-foreground">{t('sar')} {cashFlow.next30Total.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Expected inflow</p>
                </div>
              </motion.div>

              {/* Weekly forecast bar chart */}
              <motion.div variants={item} className={`${cardCls} p-5`}>
                <h3 className="text-sm font-bold mb-1">Weekly Forecast</h3>
                <p className="text-xs text-muted-foreground mb-4">Next 4 weeks · SAR</p>
                {loading ? (
                  <div className="h-28 flex items-end gap-3">
                    {[1,2,3,4].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${25+i*12}%` }} />)}
                  </div>
                ) : cashFlow.weekly.every(w => w.amount === 0) ? (
                  <p className="text-center text-sm text-muted-foreground py-4">No upcoming due dates</p>
                ) : (
                  <div className="flex items-end gap-3" style={{ height: 112 }}>
                    {cashFlow.weekly.map((w, i) => (
                      <Bar key={i} value={w.amount} max={maxCashWeekly} color="#2ED8C3" label={w.label} height={112} />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Monthly forecast bar chart */}
              <motion.div variants={item} className={`${cardCls} p-5`}>
                <h3 className="text-sm font-bold mb-1">Monthly Forecast</h3>
                <p className="text-xs text-muted-foreground mb-4">Next 3 months · SAR</p>
                {loading ? (
                  <div className="h-28 flex items-end gap-3">
                    {[1,2,3].map(i => <div key={i} className="flex-1 bg-secondary animate-pulse rounded-lg" style={{ height: `${30+i*15}%` }} />)}
                  </div>
                ) : cashFlow.monthly.every(m => m.amount === 0) ? (
                  <p className="text-center text-sm text-muted-foreground py-4">No upcoming debts with due dates</p>
                ) : (
                  <div className="flex items-end gap-4" style={{ height: 112 }}>
                    {cashFlow.monthly.map((m, i) => (
                      <Bar key={i} value={m.amount} max={maxMonthly} color="#6366F1" label={m.label} height={112} />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Forecast notes */}
              <motion.div variants={item} className="rounded-[16px] border border-border/40 bg-secondary/30 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Info size={10} /> Forecast Method
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Forecast uses due dates and remaining balances on active debts.
                  Historical payment behaviour (early/late patterns) is used to weight confidence.
                  {/* TODO ML: integrate survival analysis for payment timing prediction */}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ── CUSTOMER RISK ANALYSIS ─────────────────────────────────────── */}
          {activeTab === 'risk' && (
            <motion.div key="risk" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-4 pt-2">

              {/* Risk summary tiles */}
              <motion.div variants={item} className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Low Risk',    count: riskProfiles.filter(r => r.riskLevel === 'low').length,    color: '#10B981', bg: 'rgba(16,185,129,0.1)',  icon: UserCheck },
                  { label: 'Medium',      count: riskProfiles.filter(r => r.riskLevel === 'medium').length, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  icon: AlertTriangle },
                  { label: 'High Risk',   count: riskProfiles.filter(r => r.riskLevel === 'high').length,   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   icon: UserX },
                ].map(tile => (
                  <div key={tile.label} className="rounded-[18px] p-3 border text-center"
                       style={{ background: tile.bg, borderColor: `${tile.color}30` }}>
                    <tile.icon size={18} className="mx-auto mb-1.5" style={{ color: tile.color }} />
                    <p className="text-xl font-black" style={{ color: tile.color }}>{tile.count}</p>
                    <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{tile.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Risk list */}
              {riskProfiles.length === 0 ? (
                <motion.div variants={item} className={`${cardCls} p-8 text-center`}>
                  <Users size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">No customers yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add customers and debts to run risk analysis.</p>
                </motion.div>
              ) : (
                <motion.div variants={container} className="space-y-3">
                  {riskProfiles.map(profile => {
                    const color = trustScoreColor(profile.trustScore);
                    return (
                      <motion.div key={profile.customer.id} variants={item}
                        className={`${cardCls} p-4`}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border/60">
                            <AvatarFallback className="bg-primary/8 text-primary font-bold text-xs">
                              {getInitials(profile.customer.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold truncate">{profile.customer.fullName}</p>
                              <RiskBadge level={profile.riskLevel} />
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              {/* Trust score */}
                              <span className="text-[10px] font-bold" style={{ color }}>
                                Trust {profile.trustScore}/100
                              </span>
                              {/* Outstanding */}
                              {profile.outstanding > 0 && (
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {t('sar')} {profile.outstanding.toLocaleString()} outstanding
                                </span>
                              )}
                              {/* Overdue count */}
                              {profile.overdueCount > 0 && (
                                <span className="text-[10px] font-bold text-destructive flex items-center gap-0.5">
                                  <AlertTriangle size={9} /> {profile.overdueCount} overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ArrowUpRight size={12} className="text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Suggested Action:</span>
                          </div>
                          <ActionLabel action={profile.suggestedAction} />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Most delayed section */}
              {creditIns.mostDelayed.some(c => {
                const overdue = debts.filter(d => d.customerId === c.id && d.status === 'overdue').length;
                return overdue > 0;
              }) && (
                <motion.div variants={item} className={`${cardCls} overflow-hidden`}>
                  <div className="px-5 py-4 border-b border-border/50 bg-secondary/20 flex items-center gap-2">
                    <Flame size={14} className="text-destructive" />
                    <h3 className="text-sm font-bold">Most Delayed Customers</h3>
                  </div>
                  <div className="p-3 space-y-1">
                    {creditIns.mostDelayed.slice(0, 3).map((c, i) => {
                      const overdueCount = debts.filter(d => d.customerId === c.id && d.status === 'overdue').length;
                      if (overdueCount === 0) return null;
                      return (
                        <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                          <span className="text-[11px] font-black text-muted-foreground/60 w-4">{i + 1}</span>
                          <Avatar className="h-7 w-7 border border-border/60">
                            <AvatarFallback className="bg-destructive/10 text-destructive font-bold text-[9px]">
                              {getInitials(c.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{c.fullName}</p>
                          </div>
                          <span className="text-xs font-bold text-destructive">{overdueCount} overdue</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
