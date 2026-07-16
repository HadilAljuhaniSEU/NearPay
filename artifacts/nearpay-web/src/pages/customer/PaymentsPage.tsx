import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { TransactionItem } from '../../components/TransactionItem';
import { mockTransactions } from '../../data/mock';
import { ReceiptText } from 'lucide-react';
import { useT } from '../../contexts/LanguageContext';

type FilterId = 'all' | 'completed' | 'pending';

export default function CustomerPaymentsPage() {
  const [filter, setFilter] = useState<FilterId>('all');
  const t = useT();

  const filterOptions: { id: FilterId; labelKey: Parameters<typeof t>[0] }[] = [
    { id: 'all',       labelKey: 'filter_all' },
    { id: 'completed', labelKey: 'filter_completed' },
    { id: 'pending',   labelKey: 'status_pending' },
  ];

  const filteredTx = mockTransactions.filter(tx => {
    const txStatus = tx.status === 'paid' ? 'completed' : tx.status;
    if (filter !== 'all' && txStatus !== filter) return false;
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('payment_history_title')} />

      <div className="page-scroll px-5 py-4">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="flex gap-2">
            {filterOptions.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex-1 py-2.5 rounded-[12px] text-xs font-bold transition-all border ${
                  filter === f.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                }`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-[22px] p-5 border border-border/60 shadow-sm mt-2">
          <AnimatePresence mode="popLayout">
            {filteredTx.length > 0 ? (
              filteredTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={i < filteredTx.length - 1 ? 'border-b border-border/50 mb-3 pb-3' : ''}
                >
                  <TransactionItem {...tx} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                  <ReceiptText size={22} />
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
