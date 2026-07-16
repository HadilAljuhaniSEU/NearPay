import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { mockDebts } from '../../data/mock';
import { Filter } from 'lucide-react';

export default function CustomerDebtsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'settled'>('all');

  const myDebts = mockDebts.filter(d => d.customerId === 'c1');
  
  const filteredDebts = myDebts.filter(debt => {
    if (filter !== 'all' && debt.status !== filter) return false;
    return true;
  });

  const filters = [
    { id: 'all', label: 'All Tabs' },
    { id: 'pending', label: 'Pending' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'settled', label: 'Settled' }
  ];

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="My Tabs" />
      
      <div className="page-scroll px-6 py-4 bg-secondary/20">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-[16px] text-sm font-bold transition-all shadow-sm ${
                  filter === f.id 
                    ? 'bg-foreground text-background border border-foreground' 
                    : 'bg-card text-foreground border border-border hover:border-foreground/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredDebts.length > 0 ? (
              filteredDebts.map((debt, index) => (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <DebtCard 
                    id={debt.id}
                    customerName="Abu Khalid Store"
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
                className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[24px] border border-border mt-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Filter size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No tabs found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
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