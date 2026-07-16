import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { QrCode, Search, Store, Wallet, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { DebtCard } from '../../components/DebtCard';
import { TransactionItem } from '../../components/TransactionItem';
import { mockCustomerProfile, mockDebts, mockTransactions } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function CustomerHomePage() {
  const myDebts = mockDebts.filter(d => d.customerId === 'c1').slice(0, 2);
  const recentTx = mockTransactions.slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      
      <div className="page-scroll">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {mockCustomerProfile.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Hello,</p>
              <h1 className="text-sm font-bold text-foreground">{mockCustomerProfile.name}</h1>
            </div>
          </div>
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-card border border-border">
            <QrCode size={18} className="text-foreground" />
          </Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 py-4 space-y-8"
        >
          {/* Main Card */}
          <motion.div variants={item} className="bg-foreground text-background rounded-[24px] p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <p className="text-background/80 text-sm font-medium mb-1">Total Due Tabs</p>
              <h2 className="text-4xl font-bold tracking-tight mb-6">SAR {mockCustomerProfile.totalOwed}</h2>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold shadow-sm">
                  Pay Now
                </Button>
                <Link href="/customer/nearby" className="flex-1">
                  <Button variant="outline" className="w-full bg-background/10 border-background/20 text-background hover:bg-background/20 hover:text-background h-12 rounded-xl font-bold backdrop-blur-sm">
                    New Tab
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Active Tabs */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Active Tabs</h2>
              <Link href="/customer/debts">
                <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold h-8 rounded-full px-3">
                  See All <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {myDebts.map((debt) => (
                <DebtCard 
                  key={debt.id}
                  id={debt.id}
                  customerName="Abu Khalid Store"
                  avatar="AK"
                  amount={debt.amount}
                  dueDate={debt.dueDate}
                  status={debt.status as any}
                  category={debt.category}
                  role="customer"
                />
              ))}
            </div>
          </motion.div>

          {/* Recent Payments */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Activity</h2>
              <Link href="/customer/payments">
                <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold h-8 rounded-full px-3">
                  History <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="bg-card rounded-[20px] p-4 border border-card-border shadow-sm">
              {recentTx.map((tx) => (
                <TransactionItem key={tx.id} {...tx} />
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
