import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { useT } from '../../contexts/LanguageContext';
import { useCustomerDebts } from '../../hooks/useCustomerDebts';

type FilterId = 'all' | 'active' | 'overdue' | 'settled';
type SortId   = 'newest' | 'amount' | 'due';

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function CustomerDebtsPage() {
  const [filter, setFilter] = useState<FilterId>('all');
  const [sort,   setSort]   = useState<SortId>('newest');
  const [search, setSearch] = useState('');
  const t = useT();
  const { debts, loading } = useCustomerDebts();

  const filterOptions: { id: FilterId; labelKey: Parameters<typeof t>[0] }[] = [
    { id: 'all',     labelKey: 'all_tabs'       },
    { id: 'active',  labelKey: 'filter_active'  },
    { id: 'overdue', labelKey: 'status_overdue' },
    { id: 'settled', labelKey: 'status_settled' },
  ];

  const filteredDebts = useMemo(() => {
    let result = [...debts];

    // Status filter
    if (filter === 'active')  result = result.filter((d) => d.status === 'active' || d.status === 'pending');
    if (filter === 'overdue') result = result.filter((d) => d.status === 'overdue');
    if (filter === 'settled') result = result.filter((d) => d.status === 'settled');

    // Search: merchant name, reference number, description
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        (d.merchantName ?? '').toLowerCase().includes(q) ||
        (d.referenceNumber ?? '').toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'amount') result.sort((a, b) => b.remainingAmount - a.remainingAmount);
    else if (sort === 'due') result.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.toMillis() - b.dueDate.toMillis();
    });
    // 'newest': Firestore already orders by createdAt desc

    return result;
  }, [debts, filter, sort, search]);

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('my_tabs_title')} />

      <div className="page-scroll px-5 py-4">
        {/* Search */}
        <div className="relative mb-3">
          <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search_placeholder')}
            className="ps-10 h-11 rounded-[14px] bg-card border-border/60 text-sm"
          />
        </div>

        {/* Filter chips */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pb-3 -mx-5 px-5">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {filterOptions.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-[12px] text-xs font-bold transition-all border ${
                  filter === f.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                }`}>
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {loading ? '—' : `${filteredDebts.length} ${t('active_tabs').toLowerCase()}`}
          </p>
          <div className="flex gap-1">
            {(['newest', 'amount', 'due'] as SortId[]).map((s) => (
              <button key={s} onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-[10px] text-[10px] font-bold transition-all ${
                  sort === s
                    ? 'bg-foreground text-background'
                    : 'bg-card text-muted-foreground border border-border/60'
                }`}>
                {s === 'newest' ? t('sort_newest') : s === 'amount' ? t('sort_amount') : t('sort_due')}
              </button>
            ))}
          </div>
        </div>

        {/* Debt list */}
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredDebts.length > 0 ? (
                filteredDebts.map((debt, index) => (
                  <motion.div key={debt.id} layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.18, delay: index * 0.04 }}>
                    <DebtCard
                      id={debt.id}
                      customerName={debt.merchantName ?? debt.merchantId}
                      avatar={debt.merchantName ? getInitials(debt.merchantName) : 'M'}
                      amount={debt.remainingAmount}
                      dueDate={debt.dueDate}
                      status={debt.status}
                      role="customer"
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-16 flex flex-col items-center bg-card rounded-[22px] border border-border/60 mt-4 shadow-sm">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Filter size={22} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{t('no_tabs_found')}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{t('try_different_search')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="h-10" />
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
