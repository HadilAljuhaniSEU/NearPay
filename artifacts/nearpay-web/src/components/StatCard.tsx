import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, trend, highlight }: any) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-5 rounded-[20px] shadow-soft border ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-card-border'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${highlight ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
          <Icon size={20} className={highlight ? 'text-primary-foreground' : 'text-primary'} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${highlight ? 'bg-primary-foreground/20 text-primary-foreground' : trend.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      {trend && <p className={`text-[10px] mt-1 ${highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{trend.label}</p>}
    </motion.div>
  );
};
