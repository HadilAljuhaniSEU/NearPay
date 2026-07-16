import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { QrCode, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { DebtCard } from '../../components/DebtCard';
import { TransactionItem } from '../../components/TransactionItem';
import { mockCustomerProfile, mockDebts, mockTransactions } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useT } from '../../contexts/LanguageContext';

export default function CustomerHomePage() {
  const t = useT();
  const myDebts  = mockDebts.filter(d => d.customerId === 'c1').slice(0, 2);
  const recentTx = mockTransactions.slice(0, 3);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
  const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />

      <div className="page-scroll">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-40 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/60">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {mockCustomerProfile.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{t('greeting')}</p>
              <h1 className="text-sm font-bold text-foreground leading-tight">{mockCustomerProfile.name}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-card border border-border/60 text-foreground">
            <QrCode size={17} />
          </Button>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="px-5 py-5 space-y-5">
          {/* Balance Card */}
          <motion.div
            variants={item}
            className="text-white rounded-[24px] p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.3)' }}
          >
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full blur-3xl -me-16 -mt-16 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 start-0 w-36 h-36 rounded-full blur-3xl -ms-10 -mb-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(25,184,211,0.1) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('total_due_tabs')}</p>
              <h2 className="text-3xl font-bold tracking-tight mb-5">
                {t('sar')} {mockCustomerProfile.totalOwed}
              </h2>
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-11 rounded-xl font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #2ED8C3 0%, #19B8D3 100%)', color: '#0B2341', boxShadow: '0 2px 8px rgba(46,216,195,0.3)' }}
                >
                  {t('pay_now')}
                </Button>
                <Link href="/customer/nearby" className="flex-1">
                  <Button variant="outline" className="w-full bg-white/8 border-white/15 text-white hover:bg-white/15 hover:text-white h-11 rounded-xl font-bold text-sm">
                    {t('new_tab')}
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
                        style={{ color: '#2ED8C3' }}>
                  {t('see_all')} <ChevronRight size={13} className="ms-0.5 rtl-flip" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {myDebts.map((debt) => (
                <DebtCard
                  key={debt.id}
                  id={debt.id}
                  customerName={t('store_name_demo')}
                  avatar="AK"
                  amount={debt.amount}
                  dueDate={debt.dueDate}
                  status={debt.status as any}
                  category={debt.category}
                  role="customer"
                />
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('recent_tabs')}</h2>
              <Link href="/customer/payments">
                <Button variant="ghost" size="sm" className="text-xs font-bold h-8 rounded-full px-3 hover:bg-secondary"
                        style={{ color: '#2ED8C3' }}>
                  {t('history')} <ChevronRight size={13} className="ms-0.5 rtl-flip" />
                </Button>
              </Link>
            </div>
            <div className="bg-card rounded-[20px] p-4 border border-border/60 shadow-sm">
              {recentTx.map((tx) => (
                <TransactionItem key={tx.id} {...tx} />
              ))}
            </div>
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
