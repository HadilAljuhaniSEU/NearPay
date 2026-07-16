import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { CustomerCard } from '../../components/CustomerCard';
import { mockCustomers } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader 
        title="Clients" 
        subtitle={`${mockCustomers.length} total active clients`}
        action={
          <Button size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
            <UserPlus size={20} />
          </Button>
        }
      />
      
      <div className="page-scroll px-6 py-4 bg-secondary/30">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search by name or phone..."
              className="pl-12 h-14 rounded-2xl bg-card border border-border focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-base font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, i) => (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CustomerCard {...customer} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[24px] border border-border mt-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground">No clients found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}