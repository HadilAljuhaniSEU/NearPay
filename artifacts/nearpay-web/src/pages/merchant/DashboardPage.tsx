import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bell, Plus, Users, ArrowRight, Wallet, Activity, CreditCard, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { StatCard } from '../../components/StatCard';
import { DebtCard } from '../../components/DebtCard';
import { mockMerchant, mockDebts } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function DashboardPage() {
  const recentDebts = mockDebts.slice(0, 3);

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
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="page-scroll">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                AK
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Welcome</p>
              <h1 className="text-sm font-bold text-foreground leading-none">{mockMerchant.englishName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-card border-border relative text-foreground">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </Button>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 py-6 space-y-8"
        >
          {/* Main Card */}
          <motion.div variants={item} className="bg-foreground text-background rounded-[24px] p-6 relative overflow-hidden shadow-xl border border-border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="relative z-10">
              <p className="text-background/80 text-xs font-bold uppercase tracking-wider mb-1">Total Receivables</p>
              <h2 className="text-4xl font-bold tracking-tight mb-2">SAR {mockMerchant.balance.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-sm font-medium mb-6">
                <span className="bg-success/20 text-success px-2 py-0.5 rounded-md text-xs font-bold">+12.5%</span>
                <span className="text-background/60">vs last month</span>
              </div>
              
              <div className="flex gap-3">
                <Link href="/merchant/add-debt" className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold shadow-sm text-sm">
                    <Plus size={18} className="mr-1.5" />
                    New Tab
                  </Button>
                </Link>
                <Link href="/merchant/customers" className="flex-1">
                  <Button variant="outline" className="w-full bg-background/10 border-background/20 text-background hover:bg-background/20 hover:text-background h-12 rounded-xl font-bold backdrop-blur-sm text-sm">
                    <Users size={18} className="mr-1.5" />
                    Clients
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Active Tabs" 
              value={mockMerchant.activeCustomers} 
              icon={Users}
            />
            <StatCard 
              title="Overdue" 
              value={`SAR ${mockMerchant.overdue.toLocaleString()}`} 
              icon={Activity}
            />
          </div>

          {/* AI Insights Card */}
          <motion.div variants={item} className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 relative overflow-hidden group cursor-pointer hover:bg-primary/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI Insight
              </div>
              <ChevronRight size={16} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              <span className="font-bold">Mohammed Al-Rashid</span> owes SAR 1,250 and is 14 days overdue. Recommend sending a WhatsApp reminder today.
            </p>
          </motion.div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pl-1">Recent Activity</h2>
              <Link href="/merchant/debts">
                <Button variant="ghost" size="sm" className="text-primary text-xs font-bold h-8 rounded-full px-3 hover:bg-primary/10">
                  View All <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentDebts.map((debt, index) => {
                const cName = index === 0 ? "Khalid Al-Saud" : index === 1 ? "Mohammed Al-Rashid" : "Fatima Al-Ghamdi";
                const cAvatar = index === 0 ? "KS" : index === 1 ? "MR" : "FA";
                
                return (
                  <motion.div key={debt.id} variants={item}>
                    <DebtCard 
                      id={debt.id}
                      customerName={cName}
                      avatar={cAvatar}
                      amount={debt.amount}
                      dueDate={debt.dueDate}
                      status={debt.status as any}
                      category={debt.category}
                      role="merchant"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="h-10" />
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}