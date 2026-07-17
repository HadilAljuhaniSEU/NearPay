import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';
import { useT } from '../../contexts/LanguageContext';
import type { DebtStatus } from '../../types';

type FilterOption = 'all' | DebtStatus;

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function DebtsPage() {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const { merchant } = useAuthContext();
  const { debts, loading } = useDebts(merchant?.id ?? null);
  const t = useT();

  const filterOptions: { id: FilterOption; labelKey: keyof ReturnType<typeof useT> extends never ? string : Parameters<ReturnType<typeof useT>>[0] }[] = [
    { id: 'all',     labelKey: 'all_tabs' as const },
    { id: 'pending', labelKey: 'status_pending' as const },
    { id: 'active',  labelKey: 'status_active' as const },
    { id: 'overdue', labelKey: 'status_overdue' as const },
    { id: 'settled', labelKey: 'status_settled' as const },
  ];

  const filteredDebts = debts.filter((debt) => {
    if (filter !== 'all' && debt.status !== filter) return false;
    if (search && !debt.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('store_tabs')}
        subtitle={loading ? t('loading') : `${debts.length}`}
      />

      <div className="page-scroll px-5 py-4">
        {/* Search & Filter */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={17} />
            </div>
            <Input
              type="text"
              placeholder={t('search_customer')}
              className="pl-12 h-12 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-[12px] text-xs font-bold transition-all border ${
                  filter === f.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                }`}
              >
                {t(f.labelKey as any)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredDebts.length > 0 ? (
                filteredDebts.map((debt, index) => (
                  <motion.div
                    key={debt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.18, delay: index * 0.04 }}
                  >
                    <DebtCard
                      id={debt.id}
                      customerName={debt.customerName}
                      avatar={getInitials(debt.customerName)}
                      amount={debt.remainingAmount}
                      dueDate={debt.dueDate}
                      status={debt.status}
                      role="merchant"
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
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {search ? t('try_different_search') : t('no_tabs_filter')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        <div className="h-10" />
      </div>

      {/* FAB */}
      <Link href="/merchant/add-debt">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="absolute bottom-24 end-5 w-14 h-14 rounded-full flex items-center justify-center z-50 border-4 border-background text-navy"
          style={{ background: 'linear-gradient(135deg, #20D6C7 0%, #0FB8A9 100%)', boxShadow: '0 4px 20px rgba(32,214,199,0.4)' }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.button>
      </Link>

      <BottomNav role="merchant" />
    </div>
  );
}
