import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { ReceiptText, CheckCircle2, Clock, Store } from 'lucide-react';
import { useT } from '../../contexts/LanguageContext';
import { useCustomerDebts } from '../../hooks/useCustomerDebts';
import { fetchPaymentsForDebt } from '../../services/paymentService';
import { PaymentDoc } from '../../types';
import { format } from 'date-fns';

export default function CustomerPaymentsPage() {
  const t = useT();
  const { debts, loading: debtsLoading } = useCustomerDebts();
  const [payments,        setPayments]        = useState<PaymentDoc[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [filter,          setFilter]          = useState<'all' | 'completed'>('all');

  // Fetch payments for all customer debts when debts are loaded
  useEffect(() => {
    if (debtsLoading) return;
    if (debts.length === 0) { setPaymentsLoading(false); return; }

    setPaymentsLoading(true);
    Promise.all(debts.map((d) => fetchPaymentsForDebt(d.id)))
      .then((results) => {
        const all = results
          .flat()
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setPayments(all);
      })
      .catch(() => {})
      .finally(() => setPaymentsLoading(false));
  }, [debts, debtsLoading]);

  const loading          = debtsLoading || paymentsLoading;
  const filteredPayments = filter === 'all' ? payments : payments.filter((p) => p.status === 'completed');

  const filterOptions: { id: 'all' | 'completed'; labelKey: Parameters<typeof t>[0] }[] = [
    { id: 'all',       labelKey: 'filter_all'       },
    { id: 'completed', labelKey: 'filter_completed' },
  ];

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('payment_history_title')} />

      <div className="page-scroll px-5 py-4">
        {/* Filter chips */}
        <div className="flex gap-2 mb-4">
          {filterOptions.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 py-2.5 rounded-[12px] text-xs font-bold border transition-all ${
                filter === f.id
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
              }`}>
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-[22px] border border-border/60 shadow-sm overflow-hidden">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-secondary animate-pulse rounded-xl" />
                ))}
              </div>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((p, i) => (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 px-4 py-4 ${i < filteredPayments.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    p.status === 'completed' ? 'bg-success/10' : 'bg-secondary'
                  }`}>
                    {p.status === 'completed'
                      ? <CheckCircle2 size={18} className="text-success" />
                      : <Clock        size={18} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {t('sar')} {p.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium capitalize mt-0.5">
                      {p.paymentMethod.replace('_', ' ')} · {format(p.createdAt.toDate(), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    p.status === 'completed'
                      ? 'bg-success/10 text-success'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {p.status}
                  </span>
                </motion.div>
              ))
            ) : debts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 flex flex-col items-center gap-3 px-6">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
                  <Store size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{t('no_pending_payments')}</h3>
                </div>
                <Link href="/customer/nearby" className="mt-1">
                  <Button size="sm" className="rounded-xl font-bold px-5"
                    style={{ background: 'linear-gradient(135deg,#20D6C7,#0FB8A9)', color: '#0B2341' }}>
                    {t('discover_stores_btn')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 flex flex-col items-center">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <ReceiptText size={22} className="text-muted-foreground" />
                </div>
                <h3 className="text-base font-bold text-foreground">{t('no_transactions')}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{t('no_transactions_sub')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10" />
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
