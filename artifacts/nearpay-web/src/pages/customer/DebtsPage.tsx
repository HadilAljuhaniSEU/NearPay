import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { mockDebts } from '../../data/mock';
import { Filter } from 'lucide-react';
import { useT } from '../../contexts/LanguageContext';

type FilterId = 'all' | 'pending' | 'overdue' | 'settled';

export default function CustomerDebtsPage() {
  const [filter, setFilter] = useState<FilterId>('all');
  const t = useT();

  const myDebts = mockDebts.filter(d => d.customerId === 'c1');
  const filteredDebts = myDebts.filter(debt => filter === 'all' || debt.status === filter);

  const filterOptions: { id: FilterId; labelKey: Parameters<typeof t>[0] }[] = [
    { id: 'all',     labelKey: 'all_tabs' },
    { id: 'pending', labelKey: 'status_pending' },
    { id: 'overdue', labelKey: 'status_overdue' },
    { id: 'settled', labelKey: 'status_settled' },
  ];

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('my_tabs_title')} />

      <div className="page-scroll px-5 py-4">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {filterOptions.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-[12px] text-xs font-bold transition-all border ${
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

        <div className="space-y-3 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredDebts.length > 0 ? (
              filteredDebts.map((debt, index) => (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18, delay: index * 0.05 }}
                >
                  <DebtCard
                    id={debt.id}
                    customerName={t('store_name_demo')}
                    avatar="AK"
                    amount={debt.amount}
                    dueDate={debt.dueDate}
                    status={debt.status as any}
                    category={debt.category}
                    role="customer"
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[22px] border border-border/60 mt-4 shadow-sm"
              >
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Filter size={22} className="text-muted-foreground" />
                </div>
                <h3 className="text-base font-bold text-foreground">{t('no_tabs_found')}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{t('try_different_search')}</p>
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
