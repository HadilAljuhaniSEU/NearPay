import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { CustomerCard } from '../../components/CustomerCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCustomers } from '../../hooks/useCustomers';
import { useT } from '../../contexts/LanguageContext';

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function trustScoreToRisk(score: number): 'low' | 'medium' | 'high' {
  if (score >= 75) return 'low';
  if (score >= 50) return 'medium';
  return 'high';
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const { merchant } = useAuthContext();
  const { customers, loading } = useCustomers(merchant?.id ?? null);
  const t = useT();

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={t('customers_title')}
        subtitle={loading ? t('loading') : `${customers.length}`}
        action={
          <Button size="icon" className="rounded-full h-9 w-9 bg-secondary border border-border/60 text-foreground hover:bg-secondary/80">
            <UserPlus size={17} />
          </Button>
        }
      />

      <div className="page-scroll px-5 py-4">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-3 -mt-4 mx-[-20px] px-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
              <Search size={17} />
            </div>
            <Input
              type="text"
              placeholder={t('search_clients')}
              className="pl-12 h-12 rounded-2xl bg-card border border-border/60 shadow-sm text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 mt-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((customer, i) => (
                  <motion.div
                    key={customer.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <CustomerCard
                      id={customer.id}
                      name={customer.fullName}
                      phone={customer.phone}
                      avatar={getInitials(customer.fullName)}
                      totalDebt={customer.totalDebt}
                      trustScore={customer.trustScore}
                      risk={trustScoreToRisk(customer.trustScore)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 flex flex-col items-center justify-center bg-card rounded-[22px] border border-border/60 mt-4 shadow-sm"
                >
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                    <Users size={22} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {search ? t('no_customers_yet') : t('no_customers_yet')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {search ? t('try_different_search') : t('add_first_customer')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
