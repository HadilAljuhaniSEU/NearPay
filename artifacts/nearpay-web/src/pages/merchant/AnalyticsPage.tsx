import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockMerchant, mockCustomers } from '../../data/mock';
import { useT } from '../../contexts/LanguageContext';

const weekData = [
  { dayKey: 'day_sat', amount: 850 },
  { dayKey: 'day_sun', amount: 1200 },
  { dayKey: 'day_mon', amount: 650 },
  { dayKey: 'day_tue', amount: 1800 },
  { dayKey: 'day_wed', amount: 950 },
  { dayKey: 'day_thu', amount: 2100 },
  { dayKey: 'day_fri', amount: 450 },
] as const;

const maxVal = Math.max(...weekData.map((d) => d.amount));

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(0);
  const t = useT();

  const periodKeys = ['period_week', 'period_month', 'period_quarter'] as const;
  const collectionRate = Math.round((mockMerchant.balance - mockMerchant.overdue) / mockMerchant.balance * 100);
  const sortedCustomers = [...mockCustomers].sort((a, b) => b.totalDebt - a.totalDebt);

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('analytics_title')} />

      <div className="page-scroll px-5 py-4 space-y-5">
        {/* Period Selector */}
        <div className="flex gap-2">
          {periodKeys.map((pk, i) => (
            <button
              key={pk}
              onClick={() => setPeriod(i)}
              className={`flex-1 py-2.5 rounded-[14px] text-xs font-bold transition-all border ${
                i === period
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
              }`}
            >
              {t(pk)}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 4px 16px rgba(11,35,65,0.2)' }}
          >
            <div className="absolute top-0 end-0 w-20 h-20 rounded-full blur-xl -me-6 -mt-6 pointer-events-none"
                 style={{ background: 'rgba(46,216,195,0.2)' }} />
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1.5">{t('collected')}</p>
            <p className="text-lg font-bold text-white">{t('sar')} {(mockMerchant.balance - mockMerchant.overdue).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2.5 w-fit px-2 py-0.5 rounded-md" style={{ background: 'rgba(46,216,195,0.2)' }}>
              <TrendingUp size={11} style={{ color: '#2ED8C3' }} />
              <span className="text-[10px] font-bold" style={{ color: '#2ED8C3' }}>+8.2%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border/60 rounded-[22px] p-5 shadow-sm"
          >
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">{t('overdue_amount')}</p>
            <p className="text-lg font-bold text-destructive">{t('sar')} {mockMerchant.overdue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2.5 bg-destructive/8 w-fit px-2 py-0.5 rounded-md">
              <TrendingDown size={11} className="text-destructive" />
              <span className="text-[10px] font-bold text-destructive">3 {t('accounts')}</span>
            </div>
          </motion.div>
        </div>

        {/* Collection Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/60 rounded-[22px] p-5 flex flex-col gap-3 shadow-sm"
        >
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-foreground">{t('collection_rate')}</h3>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">{t('collection_rate_sub')}</p>
            </div>
            <p className="text-3xl font-black tracking-tight text-foreground">{collectionRate}%</p>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${collectionRate}%` }}
              transition={{ delay: 0.3, duration: 0.9, type: 'spring' }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #2ED8C3 0%, #19B8D3 100%)' }}
            />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/60 rounded-[22px] p-5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-foreground">{t('daily_collections')}</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              <Calendar size={11} /> {t('this_week')}
            </div>
          </div>
          <div className="flex items-end justify-between h-36 gap-2">
            {weekData.map((d, i) => {
              const h = Math.max(8, (d.amount / maxVal) * 100);
              const isHighest = d.amount === maxVal;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className={`text-[9px] font-bold transition-opacity ${isHighest ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        style={{ color: isHighest ? '#2ED8C3' : undefined }}>
                    {(d.amount / 1000).toFixed(1)}k
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.5, type: 'spring' }}
                    className="w-full rounded-lg relative overflow-hidden"
                    style={{
                      minHeight: 8,
                      background: isHighest
                        ? 'linear-gradient(180deg, #2ED8C3 0%, #19B8D3 100%)'
                        : 'rgba(11,35,65,0.1)',
                    }}
                  />
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isHighest ? '' : 'text-muted-foreground'}`}
                        style={isHighest ? { color: '#2ED8C3' } : {}}>
                    {t(d.dayKey)}
                  </span>
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
          className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm"
        >
          <div className="px-5 py-4 border-b border-border/60 bg-secondary/20">
            <h3 className="text-sm font-bold text-foreground">{t('top_debtors')}</h3>
          </div>
          <div className="p-2">
            {sortedCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'text-navy' :
                  i === 1 ? 'text-navy/60' :
                  'bg-secondary text-muted-foreground'
                }`} style={i === 0 ? { background: 'linear-gradient(135deg, #2ED8C3, #19B8D3)' } :
                            i === 1 ? { background: 'rgba(46,216,195,0.2)' } : {}}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {c.debtCount} {c.debtCount !== 1 ? t('active_tabs').toLowerCase() : t('tab_label_singular')}
                  </p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${c.risk === 'high' ? 'text-destructive' : 'text-foreground'}`}>
                  {t('sar')} {c.totalDebt.toLocaleString()}
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
