import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  highlight?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, trend, highlight = false }: StatCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`rounded-[20px] p-5 border ${
        highlight 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-card text-card-foreground border-card-border'
      } shadow-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
          highlight ? 'bg-white/20' : 'bg-primary/10 text-primary'
        }`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {title}
        </p>
        <h3 className="text-2xl font-bold tracking-tight">
          {typeof value === 'number' && title.includes('SAR') ? `SAR ${value.toLocaleString()}` : value}
        </h3>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className={`font-semibold ${
            highlight ? 'text-white' : trend.isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className={highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  );
};
