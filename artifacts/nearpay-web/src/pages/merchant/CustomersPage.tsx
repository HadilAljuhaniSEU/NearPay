import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
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
          <Button size="icon" variant="ghost" className="rounded-full bg-secondary text-foreground">
            <UserPlus size={18} />
          </Button>
        }
      />
      
      <div className="page-scroll px-6 py-4">
        <div className="sticky top-0 z-30 bg-background pt-2 pb-4 -mt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search by name or phone..."
              className="pl-11 h-12 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 mt-2">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CustomerCard {...customer} risk={customer.risk as 'low' | 'medium' | 'high'} />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
