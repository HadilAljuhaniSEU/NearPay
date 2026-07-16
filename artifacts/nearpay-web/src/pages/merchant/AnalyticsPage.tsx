import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockMerchant, mockCustomers } from '../../data/mock';

const PERIODS = ['Week', 'Month', 'Quarter'];

const weekData = [
  { day: 'Sat', amount: 850 },
  { day: 'Sun', amount: 1200 },
  { day: 'Mon', amount: 650 },
  { day: 'Tue', amount: 1800 },
  { day: 'Wed', amount: 950 },
  { day: 'Thu', amount: 2100 },
  { day: 'Fri', amount: 450 },
];

const maxVal = Math.max(...weekData.map((d) => d.amount));

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(0);
  const collectionRate = Math.round((mockMerchant.balance - mockMerchant.overdue) / mockMerchant.balance * 100);
  const sortedCustomers = [...mockCustomers].sort((a, b) => b.totalDebt - a.totalDebt);

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="Analytics" subtitle="Collection insights" />

      <div className="page-scroll px-6 py-4 space-y-6">
        {/* Period Selector */}
        <div className="flex gap-2">
          {PERIODS.map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriod(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === period
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-[18px] p-4"
          >
            <p className="text-xs text-primary-foreground/70 font-medium mb-1">Collected</p>
            <p className="text-xl font-bold text-primary-foreground">SAR {(mockMerchant.balance - mockMerchant.overdue).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-primary-foreground/70" />
              <span className="text-xs text-primary-foreground/70">+8.2% this week</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-[18px] p-4"
          >
            <p className="text-xs text-muted-foreground font-medium mb-1">Overdue</p>
            <p className="text-xl font-bold text-destructive">SAR {mockMerchant.overdue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown size={12} className="text-destructive" />
              <span className="text-xs text-muted-foreground">3 accounts</span>
            </div>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[18px] p-5"
        >
          <h3 className="text-sm font-bold text-foreground mb-1">Daily Collections</h3>
          <p className="text-xs text-muted-foreground mb-5">This week · SAR</p>
          <div className="flex items-end justify-between h-36 gap-2">
            {weekData.map((d, i) => {
              const h = Math.max(6, (d.amount / maxVal) * 100);
              const isHighest = d.amount === maxVal;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  {isHighest && (
                    <span className="text-[10px] font-bold text-primary">{d.amount.toLocaleString()}</span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={`w-full rounded-lg ${isHighest ? 'bg-primary' : 'bg-primary/15'}`}
                    style={{ minHeight: 6 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Collection Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-[18px] p-5 flex items-center gap-4"
        >
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">Collection Rate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Settled vs total receivables</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{collectionRate}%</p>
            <div className="w-20 h-1.5 bg-secondary rounded-full mt-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${collectionRate}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Top Debtors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[18px] overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-foreground">Top Debtors</h3>
          </div>
          {sortedCustomers.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 px-5 py-3 ${i < sortedCustomers.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.debtCount} debt{c.debtCount !== 1 ? 's' : ''}</p>
              </div>
              <p className={`text-sm font-bold ${c.risk === 'high' ? 'text-destructive' : 'text-foreground'}`}>
                SAR {c.totalDebt.toLocaleString()}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="h-8" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
