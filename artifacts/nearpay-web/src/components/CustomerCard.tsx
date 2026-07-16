import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Wallet } from 'lucide-react';

interface CustomerCardProps {
  name: string;
  phone: string;
  totalDebt: number;
  debtCount: number;
  risk: 'low' | 'medium' | 'high';
  avatar: string;
}

export const CustomerCard = ({ name, phone, totalDebt, debtCount, risk, avatar }: CustomerCardProps) => {
  const riskColors = {
    low: 'bg-success',
    medium: 'bg-warning',
    high: 'bg-destructive'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-card border border-card-border rounded-[18px] p-4 shadow-sm relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-2 h-full ${riskColors[risk]}`} />
      
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-border shadow-sm">
          <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-lg">
            {avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Phone size={14} />
            <span>{phone}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Wallet size={16} className="text-primary" />
          <span>{debtCount} active {debtCount === 1 ? 'tab' : 'tabs'}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground block mb-0.5">Total Owed</span>
          <span className="font-bold text-foreground">SAR {totalDebt}</span>
        </div>
      </div>
    </motion.div>
  );
};
