import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bell, Plus, Users, ArrowRight, Activity, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { StatCard } from '../../components/StatCard';
import { DebtCard } from '../../components/DebtCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDebts } from '../../hooks/useDebts';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { merchant } = useAuthContext();
  const { debts, loading: debtsLoading } = useDebts(merchant?.id ?? null);

  const activeDebts = debts.filter((d) => d.status !== 'settled' && d.status !== 'rejected');
  const overdueAmount = debts.reduce(
    (sum, d) => (d.status === 'overdue' ? sum + d.remainingAmount : sum),
    0
  );
  const recentDebts = debts.slice(0, 3);

  const merchantInitials = merchant?.name ? getInitials(merchant.name) : 'M';
  const balance = merchant?.totalOutstanding ?? 0;

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />

      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="page-scroll">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-xl z-40 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {merchantInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Welcome</p>
              <h1 className="text-sm font-bold text-foreground leading-none">
                {merchant?.name ?? 'Your Store'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-card border-border relative text-foreground">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 py-6 space-y-6"
        >
          {/* Balance Card */}
          <motion.div
            variants={item}
            className="bg-foreground text-white rounded-[24px] p-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl -ml-8 -mb-8 pointer-events-none" />

            <div className="relative z-10">
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Total Receivables</p>
              {merchant ? (
                <>
                  <h2 className="text-3xl font-bold tracking-tight mb-1.5">
                    SAR {balance.toLocaleString()}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-medium mb-6">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold">
                      {activeDebts.length} active
                    </span>
                    <span className="text-white/50">tabs outstanding</span>
                  </div>
                </>
              ) : (
                <div className="h-12 w-48 bg-white/10 rounded-xl animate-pulse mb-6" />
              )}

              <div className="flex gap-3">
                <Link href="/merchant/add-debt" className="flex-1">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90 h-11 rounded-xl font-bold text-sm shadow-sm">
                    <Plus size={17} className="mr-1.5" />
                    New Tab
                  </Button>
                </Link>
                <Link href="/merchant/customers" className="flex-1">
                  <Button variant="outline" className="w-full bg-white/8 border-white/15 text-white hover:bg-white/15 hover:text-white h-11 rounded-xl font-bold backdrop-blur-sm text-sm">
                    <Users size={17} className="mr-1.5" />
                    Clients
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <StatCard
              title="Active Tabs"
              value={debtsLoading ? '—' : activeDebts.length}
              icon={Users}
            />
            <StatCard
              title="Overdue"
              value={debtsLoading ? '—' : `SAR ${overdueAmount.toLocaleString()}`}
              icon={Activity}
            />
          </motion.div>

          {/* AI Insight */}
          {overdueAmount > 0 && (
            <motion.div
              variants={item}
              className="bg-primary/5 border border-primary/15 rounded-[20px] p-5 relative overflow-hidden group cursor-pointer hover:bg-primary/8 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  AI Insight
                </div>
                <ChevronRight size={15} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                You have <span className="font-bold">SAR {overdueAmount.toLocaleString()}</span> in overdue receivables.
                Consider sending payment reminders via WhatsApp to recover faster.
              </p>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">Recent Activity</h2>
              <Link href="/merchant/debts">
                <Button variant="ghost" size="sm" className="text-primary text-xs font-bold h-8 rounded-full px-3 hover:bg-primary/8">
                  View All <ArrowRight size={13} className="ml-1" />
                </Button>
              </Link>
            </div>

            {debtsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : recentDebts.length > 0 ? (
              <div className="space-y-3">
                {recentDebts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    id={debt.id}
                    customerName={debt.customerName}
                    avatar={getInitials(debt.customerName)}
                    amount={debt.remainingAmount}
                    dueDate={debt.dueDate}
                    status={debt.status}
                    role="merchant"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-[20px] border border-border">
                <p className="text-sm font-semibold text-muted-foreground">No tabs yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add your first customer tab above</p>
              </div>
            )}
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
