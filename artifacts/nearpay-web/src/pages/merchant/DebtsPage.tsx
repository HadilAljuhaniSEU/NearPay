import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { DebtCard } from '../../components/DebtCard';
import { mockDebts, mockCustomers } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function DebtsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'settled'>('all');
  const [search, setSearch] = useState('');

  const filters = [
    { id: 'all', label: 'All Tabs' },
    { id: 'pending', label: 'Pending' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'settled', label: 'Settled' }
  ];

  const filteredDebts = mockDebts.filter(debt => {
    if (filter !== 'all' && debt.status !== filter) return false;
    if (search) {
      const customer = mockCustomers.find(c => c.id === debt.customerId);
      if (!customer?.name.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader 
        title="Store Tabs" 
        subtitle="Manage customer debts"
      />
      
      <div className="page-scroll px-6 py-4">
        {/* Search & Filter */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur pt-2 pb-4 -mt-2 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-11 h-12 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

        {/* List */}
        <div className="space-y-3 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredDebts.length > 0 ? (
              filteredDebts.map((debt) => {
                const customer = mockCustomers.find(c => c.id === debt.customerId);
                if (!customer) return null;
                
                return (
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
                      customerName={customer.name}
                      avatar={customer.avatar}
                      amount={debt.amount}
                      dueDate={debt.dueDate}
                      status={debt.status as any}
                      category={debt.category}
                      role="merchant"
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No tabs found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <Link href="/merchant/add-debt">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg flex items-center justify-center z-50 hover-elevate"
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.button>
      </Link>

      <BottomNav role="merchant" />
    </div>
  );
}
