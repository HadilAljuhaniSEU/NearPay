import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, Users, ArrowRight, ChevronRight, Sparkles,
  CheckCircle2, XCircle, AlertTriangle, Clock, TrendingUp,
  Wallet, BarChart3, CalendarDays, X, DollarSign, Settings,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';
import { useCustomers } from '../../hooks/useCustomers';
import { useT } from '../../contexts/LanguageContext';
import { DebtDoc } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function useCountUp(target: number, duration = 700) {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === target) return;
    prevRef.current = target;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - (1 - p) ** 3;
      setCurrent(Math.round(prev + (target - prev) * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return current;
}

const NOTIF_CONFIG: Record<string, { icon: React.ElementType; color: string; labelKey: string }> = {
  approved: { icon: CheckCircle2, color: '#20D6C7',  labelKey: 'notif_approved' },
  rejected: { icon: XCircle,      color: '#EF4444',  labelKey: 'notif_rejected' },
  overdue:  { icon: AlertTriangle,color: '#F59E0B',  labelKey: 'notif_overdue'  },
  settled:  { icon: DollarSign,   color: '#6366F1',  labelKey: 'notif_settled'  },
  created:  { icon: Clock,        color: '#0FB8A9',  labelKey: 'notif_created'  },
};

interface NotifItem { id: string; type: string; name: string; amount: number; ts: number; }

function NotifRow({ item, t, isRead }: { item: NotifItem; t: (k: any, ...a: string[]) => string; isRead: boolean }) {
  const cfg = NOTIF_CONFIG[item.type] ?? NOTIF_CONFIG.created;
  const Icon = cfg.icon;
  const timeStr = item.ts ? formatDistanceToNow(new Date(item.ts), { addSuffix: true }) : '';
  return (
    <div className={`flex items-start gap-3 px-3 py-3 rounded-2xl hover:bg-secondary/50 transition-colors relative ${isRead ? 'opacity-70' : ''}`}>
      {!isRead && (
        <span className="absolute top-3 end-3 w-2 h-2 rounded-full" style={{ background: cfg.color }} />
      )}
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
           style={{ background: `${cfg.color}18` }}>
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0 pe-4">
        <p className="text-sm font-bold text-foreground leading-tight">{t(cfg.labelKey as any)}</p>
        <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{item.name} · {t('sar')} {item.amount.toLocaleString()}</p>
      </div>
      <p className="text-[10px] text-muted-foreground font-medium flex-shrink-0 mt-0.5">{timeStr}</p>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, prefix, icon: Icon, color, isLoading,
}: {
  title: string; value: number | string; prefix?: string;
  icon: React.ElementType; color: string; isLoading: boolean;
}) {
  const num = typeof value === 'number' ? value : 0;
  const animated = useCountUp(num);
  return (
    <div className="bg-card border border-border/60 rounded-[20px] p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight pe-1">{title}</p>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: `${color}14` }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      {isLoading ? (
        <div className="h-6 w-20 bg-secondary animate-pulse rounded-lg" />
      ) : (
        <p className="text-[1.15rem] font-bold text-foreground tracking-tight leading-none">
          {prefix && <span className="text-xs font-bold text-muted-foreground me-1">{prefix}</span>}
          {typeof value === 'number' ? animated.toLocaleString() : value}
        </p>
      )}
    </div>
  );
}

// ─── Animation variants ───────────────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item      = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { merchant } = useAuthContext();
  const { debts, loading: debtsLoading } = useDebts(merchant?.id ?? null);
  useCustomers(merchant?.id ?? null); // subscribe so customer counts are live
  const t = useT();

  const [showNotif, setShowNotif] = useState(false);

  // ── Notification read / clear state (persisted in localStorage) ──────────
  const [readIds, setReadIds] = useState<Set<string>>(() =>
    new Set(JSON.parse(localStorage.getItem('np_read_notifs') || '[]'))
  );
  const [clearedIds, setClearedIds] = useState<Set<string>>(() =>
    new Set(JSON.parse(localStorage.getItem('np_cleared_notifs') || '[]'))
  );

  // ── Derived KPIs ─────────────────────────────────────────────────────────
  const now  = Date.now();
  const in30 = now + 30 * 24 * 60 * 60 * 1000;
  const in7  = now + 7  * 24 * 60 * 60 * 1000;

  const activeDebts = useMemo(
    () => debts.filter(d => d.status !== 'settled' && d.status !== 'rejected'), [debts]);
  const overdueDebts = useMemo(
    () => debts.filter(d => d.status === 'overdue'), [debts]);

  const totalOutstanding = useMemo(
    () => activeDebts.reduce((s, d) => s + d.remainingAmount, 0), [activeDebts]);
  const totalCollected   = merchant?.totalCollected ?? 0;
  const overdueAmount    = useMemo(
    () => overdueDebts.reduce((s, d) => s + d.remainingAmount, 0), [overdueDebts]);
  const activeCustomers  = useMemo(
    () => new Set(activeDebts.map(d => d.customerId)).size, [activeDebts]);
  const expectedCashFlow = useMemo(
    () => debts.filter(d =>
      d.status !== 'settled' && d.status !== 'rejected' &&
      d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in30
    ).reduce((s, d) => s + d.remainingAmount, 0),
    [debts]);

  // ── Notifications (derived from debts) ────────────────────────────────────
  const notifications = useMemo<NotifItem[]>(() => {
    const items: NotifItem[] = [];
    debts.forEach(d => {
      const upd = d.updatedAt?.toMillis?.() ?? 0;
      const crt = d.createdAt?.toMillis?.() ?? 0;
      if (d.approvalStatus === 'approved') items.push({ id: d.id+'_ap', type: 'approved', name: d.customerName, amount: d.amount,         ts: upd });
      if (d.approvalStatus === 'rejected') items.push({ id: d.id+'_rj', type: 'rejected', name: d.customerName, amount: d.amount,         ts: upd });
      if (d.status === 'overdue')          items.push({ id: d.id+'_ov', type: 'overdue',  name: d.customerName, amount: d.remainingAmount, ts: upd });
      if (d.status === 'settled')          items.push({ id: d.id+'_st', type: 'settled',  name: d.customerName, amount: d.amount,         ts: upd });
      items.push({ id: d.id+'_cr', type: 'created', name: d.customerName, amount: d.amount, ts: crt });
    });
    return items.sort((a, b) => b.ts - a.ts).slice(0, 12);
  }, [debts]);

  const visibleNotifications = useMemo(
    () => notifications.filter(n => !clearedIds.has(n.id)),
    [notifications, clearedIds]);

  const urgentCount = useMemo(
    () => visibleNotifications.filter(n =>
      (n.type === 'approved' || n.type === 'overdue') && !readIds.has(n.id)
    ).length,
    [visibleNotifications, readIds]);

  const handleMarkAllRead = () => {
    const ids = new Set([...readIds, ...visibleNotifications.map(n => n.id)]);
    localStorage.setItem('np_read_notifs', JSON.stringify([...ids]));
    setReadIds(ids);
  };

  const handleClearAll = () => {
    const ids = new Set([...clearedIds, ...visibleNotifications.map(n => n.id)]);
    localStorage.setItem('np_cleared_notifs', JSON.stringify([...ids]));
    setClearedIds(ids);
    setShowNotif(false);
  };

  // ── AI Insights (calculated from live data) ───────────────────────────────
  const collectionRate = (totalCollected + totalOutstanding) > 0
    ? Math.round(totalCollected / (totalCollected + totalOutstanding) * 100) : 0;
  const overdueCustomers = new Set(overdueDebts.map(d => d.customerId)).size;
  const thisWeekExpected = debts
    .filter(d => d.status !== 'settled' && d.status !== 'rejected' &&
      d.dueDate && d.dueDate.toMillis() > now && d.dueDate.toMillis() <= in7)
    .reduce((s, d) => s + d.remainingAmount, 0);
  const pendingApprovals = debts.filter(d => d.approvalStatus === 'pending').length;

  const insights = useMemo(() => [
    overdueCustomers > 0
      ? `${overdueCustomers} customer${overdueCustomers > 1 ? 's have' : ' has'} overdue payments totalling SAR ${overdueAmount.toLocaleString()}.`
      : null,
    (totalCollected + totalOutstanding) > 0
      ? `Collection rate is ${collectionRate}%${collectionRate >= 80 ? ' — excellent.' : collectionRate >= 60 ? ' — on track.' : ' — needs attention.'}`
      : null,
    thisWeekExpected > 0
      ? `Expected cash inflow this week: SAR ${thisWeekExpected.toLocaleString()}.`
      : null,
    pendingApprovals > 0
      ? `${pendingApprovals} tab${pendingApprovals > 1 ? 's' : ''} awaiting customer approval.`
      : null,
    activeDebts.length > 0 && overdueCustomers === 0
      ? `All ${activeDebts.length} active tab${activeDebts.length !== 1 ? 's' : ''} are on track.`
      : null,
  ].filter(Boolean) as string[], [
    overdueCustomers, overdueAmount, collectionRate, thisWeekExpected,
    pendingApprovals, activeDebts.length, totalCollected, totalOutstanding,
  ]);

  const animBalance    = useCountUp(totalOutstanding);
  const merchantInitials = merchant?.name ? getInitials(merchant.name) : 'M';
  const recentDebts    = debts.slice(0, 3);

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full blur-[130px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.07) 0%, transparent 70%)' }} />

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-40 border-b border-border/30 relative">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/60">
            <AvatarFallback className="bg-primary/8 text-primary font-bold text-xs">{merchantInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">{t('dashboard_greeting')}</p>
            <h1 className="text-sm font-bold text-foreground leading-none">{merchant?.name ?? t('your_store')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="outline" size="icon"
            className="rounded-full h-9 w-9 bg-card border-border/60 relative text-foreground"
            onClick={() => setShowNotif(v => !v)}>
            <Bell size={15} />
            {urgentCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-destructive rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-background px-0.5">
                {urgentCount > 9 ? '9+' : urgentCount}
              </span>
            )}
          </Button>
          <Link href="/merchant/settings">
            <Button variant="outline" size="icon"
              className="rounded-full h-9 w-9 bg-card border-border/60 text-foreground">
              <Settings size={15} />
            </Button>
          </Link>
        </div>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotif && (
            <>
              <motion.div key="backdrop" className="fixed inset-0 z-40" onClick={() => setShowNotif(false)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div key="panel"
                className="absolute top-full end-0 z-50 bg-card border border-border/60 rounded-[22px] shadow-2xl overflow-hidden"
                style={{ width: 'min(340px, 90vw)', maxHeight: 420, overflowY: 'auto', marginTop: 8 }}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}>
                <div className="px-4 py-3 border-b border-border/60 sticky top-0 bg-card z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold">{t('notif_title')}</h3>
                    <button onClick={() => setShowNotif(false)}
                      className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </div>
                  {visibleNotifications.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-primary hover:underline">
                        {t('mark_all_read')}
                      </button>
                      <span className="text-muted-foreground/40 text-[10px]">·</span>
                      <button onClick={handleClearAll}
                        className="text-[10px] font-bold text-muted-foreground hover:text-destructive">
                        {t('clear_notifications')}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  {visibleNotifications.length === 0
                    ? <p className="text-center text-sm text-muted-foreground py-6">{t('notif_empty')}</p>
                    : visibleNotifications.map(n => <NotifRow key={n.id} item={n} t={t} isRead={readIds.has(n.id)} />)
                  }
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Page Scroll ────────────────────────────────────────────────────── */}
      <div className="page-scroll" onClick={() => showNotif && setShowNotif(false)}>
        <motion.div variants={container} initial="hidden" animate="show" className="px-5 py-5 space-y-5">

          {/* Hero Balance Card */}
          <motion.div variants={item}
            className="text-white rounded-[24px] p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.3)' }}>
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full blur-3xl -me-16 -mt-16 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 start-0 w-36 h-36 rounded-full blur-3xl -ms-10 -mb-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(25,184,211,0.1) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('total_receivables')}</p>
              {debtsLoading && !merchant ? (
                <div className="h-10 w-44 bg-white/10 rounded-xl animate-pulse mb-5" />
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tight mb-1.5">
                    {t('sar')} {animBalance.toLocaleString()}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-medium mb-5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md font-bold" style={{ color: '#20D6C7', background: 'rgba(32,214,199,0.15)' }}>
                      {activeDebts.length} {t('active_tabs').toLowerCase()}
                    </span>
                    {overdueDebts.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md font-bold text-red-300" style={{ background: 'rgba(239,68,68,0.18)' }}>
                        {overdueDebts.length} overdue
                      </span>
                    )}
                    <span className="text-white/40">{t('outstanding')}</span>
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <Link href="/merchant/add-debt" className="flex-1">
                  <Button className="w-full h-11 rounded-xl font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #20D6C7 0%, #0FB8A9 100%)', color: '#0B2341', boxShadow: '0 2px 8px rgba(32,214,199,0.3)' }}>
                    <Plus size={16} className="me-1.5" /> {t('new_tab')}
                  </Button>
                </Link>
                <Link href="/merchant/customers" className="flex-1">
                  <Button variant="outline" className="w-full bg-white/8 border-white/15 text-white hover:bg-white/15 hover:text-white h-11 rounded-xl font-bold backdrop-blur-sm text-sm">
                    <Users size={16} className="me-1.5" /> {t('clients_btn')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── 6 KPI Cards ─────────────────────────────────────────────────── */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <KpiCard title={t('kpi_outstanding')} value={totalOutstanding} prefix={t('sar')} icon={Wallet}       color="#20D6C7" isLoading={debtsLoading} />
            <KpiCard title={t('kpi_collected')}   value={totalCollected}   prefix={t('sar')} icon={TrendingUp}   color="#0B2341" isLoading={debtsLoading} />
            <KpiCard title={t('kpi_overdue')}     value={overdueAmount}    prefix={t('sar')} icon={AlertTriangle} color="#EF4444" isLoading={debtsLoading} />
            <KpiCard title={t('kpi_customers')}   value={activeCustomers}              icon={Users}         color="#0FB8A9" isLoading={debtsLoading} />
            <KpiCard title={t('kpi_total_debts')} value={debts.length}                 icon={BarChart3}     color="#6366F1" isLoading={debtsLoading} />
            <KpiCard title={t('kpi_cashflow')}    value={expectedCashFlow} prefix={t('sar')} icon={CalendarDays} color="#10B981" isLoading={debtsLoading} />
          </motion.div>

          {/* ── AI Insights ──────────────────────────────────────────────────── */}
          {(insights.length > 0 || debtsLoading) && (
            <motion.div variants={item}
              className="rounded-[20px] p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(32,214,199,0.07) 0%, rgba(25,184,211,0.04) 100%)', border: '1px solid rgba(32,214,199,0.18)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#20D6C7' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#20D6C7' }} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#20D6C7' }}>
                  <Sparkles size={11} className="inline me-1" />{t('ai_insights')}
                </span>
              </div>
              {debtsLoading
                ? [1,2,3].map(i => <div key={i} className="h-4 bg-teal/8 rounded-lg animate-pulse mb-2" style={{ width: `${60 + i*12}%` }} />)
                : (
                  <ul className="space-y-2">
                    {insights.slice(0, 4).map((ins, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground leading-snug">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#20D6C7' }} />
                        {ins}
                      </li>
                    ))}
                  </ul>
                )
              }
            </motion.div>
          )}

          {/* ── Recent Tabs ──────────────────────────────────────────────────── */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('recent_tabs')}</h2>
              <Link href="/merchant/debts">
                <Button variant="ghost" size="sm" className="text-xs font-bold h-8 rounded-full px-3 hover:bg-secondary" style={{ color: '#20D6C7' }}>
                  {t('view_all')} <ArrowRight size={12} className="ms-1 rtl-flip" />
                </Button>
              </Link>
            </div>

            {debtsLoading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
            ) : recentDebts.length > 0 ? (
              <div className="space-y-3">
                {recentDebts.map((debt) => (
                  <DebtCard key={debt.id} id={debt.id} customerName={debt.customerName}
                    avatar={getInitials(debt.customerName)} amount={debt.remainingAmount}
                    dueDate={debt.dueDate} status={debt.status} role="merchant" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-[20px] border border-border/60">
                <p className="text-sm font-semibold text-muted-foreground">{t('no_tabs_yet')}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{t('add_first_tab')}</p>
              </div>
            )}
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
