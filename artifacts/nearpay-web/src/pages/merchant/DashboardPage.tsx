import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bell, Plus, Users, ArrowRight, Activity, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { StatCard } from '../../components/StatCard';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';
import { useT } from '../../contexts/LanguageContext';

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { merchant } = useAuthContext();
  const { debts, loading: debtsLoading } = useDebts(merchant?.id ?? null);
  const t = useT();

  const activeDebts = debts.filter((d) => d.status !== 'settled' && d.status !== 'rejected');
  const overdueAmount = debts.reduce(
    (sum, d) => (d.status === 'overdue' ? sum + d.remainingAmount : sum),
    0
  );
  const recentDebts = debts.slice(0, 3);
  const merchantInitials = merchant?.name ? getInitials(merchant.name) : 'M';
  const balance = merchant?.totalOutstanding ?? 0;

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full blur-[130px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.07) 0%, transparent 70%)' }} />

      <div className="page-scroll">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-40 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/60">
              <AvatarFallback className="bg-primary/8 text-primary font-bold text-xs">
                {merchantInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">
                {t('dashboard_greeting')}
              </p>
              <h1 className="text-sm font-bold text-foreground leading-none">
                {merchant?.name ?? t('your_store')}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-card border-border/60 relative text-foreground">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>
          </div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="px-5 py-5 space-y-5">
          {/* Balance Card */}
          <motion.div
            variants={item}
            className="text-white rounded-[24px] p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.3), 0 2px 8px rgba(11,35,65,0.15)' }}
          >
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full blur-3xl -me-16 -mt-16 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 start-0 w-36 h-36 rounded-full blur-3xl -ms-10 -mb-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(25,184,211,0.1) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('total_receivables')}</p>
              {merchant ? (
                <>
                  <h2 className="text-3xl font-bold tracking-tight mb-1.5">
                    {t('sar')} {balance.toLocaleString()}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-medium mb-5">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[#2ED8C3]"
                          style={{ background: 'rgba(46,216,195,0.15)' }}>
                      {activeDebts.length} {t('active_tabs').toLowerCase()}
                    </span>
                    <span className="text-white/40">{t('outstanding')}</span>
                  </div>
                </>
              ) : (
                <div className="h-12 w-48 bg-white/10 rounded-xl animate-pulse mb-5" />
              )}

              <div className="flex gap-3">
                <Link href="/merchant/add-debt" className="flex-1">
                  <Button
                    className="w-full h-11 rounded-xl font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2ED8C3 0%, #19B8D3 100%)', color: '#0B2341', boxShadow: '0 2px 8px rgba(46,216,195,0.3)' }}
                  >
                    <Plus size={16} className="me-1.5" />
                    {t('new_tab')}
                  </Button>
                </Link>
                <Link href="/merchant/customers" className="flex-1">
                  <Button variant="outline" className="w-full bg-white/8 border-white/15 text-white hover:bg-white/15 hover:text-white h-11 rounded-xl font-bold backdrop-blur-sm text-sm">
                    <Users size={16} className="me-1.5" />
                    {t('clients_btn')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <StatCard title={t('active_tabs')} value={debtsLoading ? '—' : activeDebts.length} icon={Users} />
            <StatCard title={t('overdue_amount')} value={debtsLoading ? '—' : `${t('sar')} ${overdueAmount.toLocaleString()}`} icon={Activity} />
          </motion.div>

          {/* AI Insight */}
          {overdueAmount > 0 && (
            <motion.div
              variants={item}
              className="rounded-[18px] p-4 relative overflow-hidden cursor-pointer transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(46,216,195,0.08) 0%, rgba(25,184,211,0.05) 100%)', border: '1px solid rgba(46,216,195,0.2)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider" style={{ color: '#2ED8C3' }}>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#2ED8C3' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#2ED8C3' }} />
                  </span>
                  {t('ai_insight')}
                </div>
                <ChevronRight size={14} className="text-muted-foreground rtl-flip" />
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {t('overdue_insight', overdueAmount.toLocaleString())}
              </p>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('recent_tabs')}</h2>
              <Link href="/merchant/debts">
                <Button variant="ghost" size="sm" className="text-xs font-bold h-8 rounded-full px-3 hover:bg-secondary" style={{ color: '#2ED8C3' }}>
                  {t('view_all')} <ArrowRight size={12} className="ms-1 rtl-flip" />
                </Button>
              </Link>
            </div>

            {debtsLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
            ) : recentDebts.length > 0 ? (
              <div className="space-y-3">
                {recentDebts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    id={debt.id}
                    customerName={debt.customerName}
                    avatar={getInitials(debt.customerName)}
                    amount={debt.remainingAmount}
                    dueDate={debt.dueDate}
                    status={debt.status}
                    role="merchant"
                  />
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
