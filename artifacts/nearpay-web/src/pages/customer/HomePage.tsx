import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { CreditCard, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useT } from '../../contexts/LanguageContext';
import { useCustomerDebts } from '../../hooks/useCustomerDebts';
import { useAuthContext } from '../../contexts/AuthContext';

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function CustomerHomePage() {
  const t = useT();
  const { debts, loading, customerName } = useCustomerDebts();
  const { user } = useAuthContext();

  // Prefer Firebase auth displayName first name, fall back to merchant-entered name
  const firstName = user?.displayName?.trim().split(/\s+/)[0]
    ?? customerName?.trim().split(/\s+/)[0]
    ?? '';

  const activeDebts  = debts.filter((d) => d.status !== 'settled' && d.status !== 'rejected');
  const totalDue     = activeDebts.reduce((s, d) => s + d.remainingAmount, 0);
  const recentDebts  = activeDebts.slice(0, 2);
  const initials     = (firstName || customerName) ? getInitials(firstName || customerName) : '?';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />

      <div className="page-scroll">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-40 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/60">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              {firstName && (
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{t('greeting')}</p>
              )}
              <h1 className="text-sm font-bold text-foreground leading-tight">
                {firstName || t('hello')}
              </h1>
            </div>
          </div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="px-5 py-5 space-y-5">

          {/* Balance Card */}
          <motion.div variants={item}
            className="text-white rounded-[24px] p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.3)' }}>
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full blur-3xl -me-16 -mt-16 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 start-0 w-36 h-36 rounded-full blur-3xl -ms-10 -mb-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(25,184,211,0.1) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('total_due_tabs')}</p>
              {loading ? (
                <div className="h-9 w-36 bg-white/10 rounded-xl animate-pulse mb-5" />
              ) : (
                <h2 className="text-3xl font-bold tracking-tight mb-5">{t('sar')} {totalDue.toLocaleString()}</h2>
              )}
              <div className="flex gap-3">
                <Link href="/customer/debts" className="flex-1">
                  <Button className="w-full h-11 rounded-xl font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #20D6C7 0%, #0FB8A9 100%)', color: '#0B2341', boxShadow: '0 2px 8px rgba(32,214,199,0.3)' }}>
                    <CreditCard size={15} className="me-1.5" /> {t('pay_now')}
                  </Button>
                </Link>
                <Link href="/customer/debts" className="flex-1">
                  <Button variant="outline"
                    className="w-full bg-white/8 border-white/15 text-white hover:bg-white/15 hover:text-white h-11 rounded-xl font-bold text-sm">
                    {t('view_all')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Active Tabs */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('active_tabs')}</h2>
              <Link href="/customer/debts">
                <Button variant="ghost" size="sm" className="text-xs font-bold h-8 rounded-full px-3 hover:bg-secondary"
                        style={{ color: '#20D6C7' }}>
                  {t('see_all')} <ChevronRight size={13} className="ms-0.5 rtl-flip" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">{[1, 2].map((i) => <SkeletonCard key={i} />)}</div>
            ) : recentDebts.length > 0 ? (
              <div className="space-y-3">
                {recentDebts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    id={debt.id}
                    customerName={debt.merchantName ?? debt.merchantId}
                    avatar={debt.merchantName ? getInitials(debt.merchantName) : 'M'}
                    amount={debt.remainingAmount}
                    dueDate={debt.dueDate}
                    status={debt.status}
                    role="customer"
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 bg-card rounded-[20px] border border-border/60 flex flex-col items-center gap-3 text-center px-5">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <CreditCard size={22} className="text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t('no_debts_customer')}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[240px]">{t('no_debts_customer_sub')}</p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
