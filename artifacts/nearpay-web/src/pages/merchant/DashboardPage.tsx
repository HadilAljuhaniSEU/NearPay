import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bell, Plus, Users, ArrowRight, Wallet, Activity } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { StatCard } from '../../components/StatCard';
import { DebtCard } from '../../components/DebtCard';
import { mockMerchant, mockDebts } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      
      <div className="page-scroll">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-40 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                AK
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Welcome back</p>
              <h1 className="text-sm font-bold text-foreground">{mockMerchant.englishName}</h1>
            </div>
          </div>
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 relative">
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-card"></span>
          </Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 py-6 space-y-8"
        >
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <StatCard 
                title="Total Receivables" 
                value={mockMerchant.balance} 
                icon={Wallet}
                trend={{ value: 12.5, label: "vs last month", isPositive: true }}
                highlight
              />
            </div>
            <StatCard 
              title="Active Tabs" 
              value={mockMerchant.activeCustomers} 
              icon={Users}
            />
            <StatCard 
              title="Overdue" 
              value={`SAR ${mockMerchant.overdue}`} 
              icon={Activity}
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Quick Actions</h2>
            <div className="flex gap-4">
              <Link href="/merchant/add-debt" className="flex-1">
                <Button className="w-full h-14 rounded-[18px] bg-primary text-primary-foreground font-semibold shadow-sm hover-elevate gap-2">
                  <Plus size={20} />
                  New Tab
                </Button>
              </Link>
              <Link href="/merchant/customers" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-[18px] font-semibold border-border gap-2">
                  <Users size={20} className="text-muted-foreground" />
                  Clients
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Activity</h2>
              <Link href="/merchant/debts">
                <Button variant="ghost" size="sm" className="text-primary text-xs font-semibold h-8 rounded-full px-3">
                  View All <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentDebts.map((debt, index) => {
                const customer = mockMerchant.id ? { name: "Customer", avatar: "C" } : null; // simplified lookup for mock
                // Mock lookup
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
          
          {/* Spacer for bottom nav */}
          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
