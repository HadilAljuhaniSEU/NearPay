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
      
      <div className="page-scroll px-6 py-4 bg-secondary/30">
        {/* Search & Filter */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-12 h-14 rounded-2xl bg-card border border-border focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-base font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-[16px] text-sm font-bold transition-all shadow-sm border ${
                  filter === f.id 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-card text-foreground border-border hover:border-foreground/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredDebts.length > 0 ? (
              filteredDebts.map((debt, index) => {
                const customer = mockCustomers.find(c => c.id === debt.customerId);
                if (!customer) return null;
                
                return (
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
                className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[24px] border border-border mt-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Filter size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No tabs found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-10" />
      </div>

      {/* FAB */}
      <Link href="/merchant/add-debt">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-24 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-50 hover-elevate border-4 border-background"
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      </Link>

      <BottomNav role="merchant" />
    </div>
  );
}