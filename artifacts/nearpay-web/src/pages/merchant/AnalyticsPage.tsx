import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
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
      <PageHeader title="Analytics" />

      <div className="page-scroll px-6 py-4 space-y-6 bg-secondary/30">
        {/* Period Selector */}
        <div className="flex gap-2">
          {PERIODS.map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriod(i)}
              className={`flex-1 py-2.5 rounded-[16px] text-sm font-bold transition-all shadow-sm border ${
                i === period
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-foreground border-border hover:border-foreground/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-[24px] p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
            <p className="text-xs text-primary-foreground/80 font-bold uppercase tracking-widest mb-2">Collected</p>
            <p className="text-2xl font-bold text-primary-foreground">SAR {(mockMerchant.balance - mockMerchant.overdue).toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-3 bg-white/20 w-fit px-2 py-1 rounded-md backdrop-blur-sm">
              <TrendingUp size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white">+8.2%</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-[24px] p-5 shadow-sm"
          >
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Overdue</p>
            <p className="text-2xl font-bold text-destructive">SAR {mockMerchant.overdue.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-3 bg-destructive/10 w-fit px-2 py-1 rounded-md">
              <TrendingDown size={12} className="text-destructive" />
              <span className="text-[10px] font-bold text-destructive">3 accounts</span>
            </div>
          </motion.div>
        </div>

        {/* Collection Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-4 shadow-sm"
        >
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-foreground">Collection Rate</h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Settled vs total receivables</p>
            </div>
            <p className="text-3xl font-black tracking-tight text-primary">{collectionRate}%</p>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mt-1 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${collectionRate}%` }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
            />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-[24px] p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground">Daily Collections</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              <Calendar size={12} /> This Week
            </div>
          </div>
          <div className="flex items-end justify-between h-40 gap-3">
            {weekData.map((d, i) => {
              const h = Math.max(8, (d.amount / maxVal) * 100);
              const isHighest = d.amount === maxVal;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  {isHighest && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded opacity-100 transition-opacity">
                      {(d.amount / 1000).toFixed(1)}k
                    </span>
                  )}
                  {!isHighest && (
                    <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {(d.amount / 1000).toFixed(1)}k
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5, type: "spring" }}
                    className={`w-full rounded-lg relative overflow-hidden ${isHighest ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/30 transition-colors'}`}
                    style={{ minHeight: 8 }}
                  >
                    {isHighest && <div className="absolute inset-0 bg-white/20" />}
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isHighest ? 'text-primary' : 'text-muted-foreground'}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Debtors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm"
        >
          <div className="px-6 py-5 border-b border-border bg-secondary/30">
            <h3 className="text-sm font-bold text-foreground">Top Debtors</h3>
          </div>
          <div className="p-2">
            {sortedCustomers.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-primary text-primary-foreground shadow-sm' : 
                    i === 1 ? 'bg-primary/20 text-primary' : 
                    'bg-secondary text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{c.debtCount} active tab{c.debtCount !== 1 ? 's' : ''}</p>
                </div>
                <p className={`text-sm font-bold ${c.risk === 'high' ? 'text-destructive' : 'text-foreground'}`}>
                  SAR {c.totalDebt.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-10" />
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}