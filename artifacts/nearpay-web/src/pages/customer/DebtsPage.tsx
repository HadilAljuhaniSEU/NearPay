import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { mockDebts } from '../../data/mock';

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
      <PageHeader 
        title="My Tabs" 
      />
      
      <div className="page-scroll px-6 py-4">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur pt-2 pb-4 -mt-2">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.id 
                    ? 'bg-foreground text-background shadow-sm' 
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredDebts.length > 0 ? (
              filteredDebts.map((debt) => (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
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
                className="text-center py-12"
              >
                <h3 className="text-lg font-semibold text-foreground">No tabs found</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
