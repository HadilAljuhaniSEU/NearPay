import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';
import type { DebtStatus } from '../../types';

type FilterOption = 'all' | DebtStatus;

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const filters: { id: FilterOption; label: string }[] = [
  { id: 'all', label: 'All Tabs' },
  { id: 'pending', label: 'Pending' },
  { id: 'active', label: 'Active' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'settled', label: 'Settled' },
];

export default function DebtsPage() {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');

  const { merchant } = useAuthContext();
  const { debts, loading } = useDebts(merchant?.id ?? null);

  const filteredDebts = debts.filter((debt) => {
    if (filter !== 'all' && debt.status !== filter) return false;
    if (search && !debt.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title="Store Tabs"
        subtitle={loading ? 'Loading...' : `${debts.length} total tabs`}
      />

      <div className="page-scroll px-6 py-4 bg-secondary/20">
        {/* Search & Filter */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search by customer name..."
              className="pl-12 h-12 rounded-2xl bg-card border border-border focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-[14px] text-xs font-bold transition-all border ${
                  filter === f.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-card text-foreground border-border hover:border-foreground/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
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
                  className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[22px] border border-border mt-4"
                >
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Filter size={22} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">No tabs found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {search ? 'Try a different search term' : 'No tabs in this category yet'}
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/25 flex items-center justify-center z-50 border-4 border-background"
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.button>
      </Link>

      <BottomNav role="merchant" />
    </div>
  );
}
