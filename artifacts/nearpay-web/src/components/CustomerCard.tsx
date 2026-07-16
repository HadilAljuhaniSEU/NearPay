import React from 'react';
import { Phone, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

export interface CustomerCardProps {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  totalDebt: number;
  trustScore: number;
  risk: 'low' | 'medium' | 'high';
}

export const CustomerCard = ({ name, phone, avatar, totalDebt, trustScore, risk }: CustomerCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-card-border p-5 rounded-[20px] shadow-soft cursor-pointer flex items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 shadow-sm">
            {risk === 'low' ? (
              <ShieldCheck size={16} className="text-success" />
            ) : (
              <AlertTriangle size={16} className={risk === 'high' ? 'text-destructive' : 'text-warning'} />
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-foreground text-base leading-tight">{name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Phone size={12} />
            <span className="font-medium">{phone}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-bold text-foreground/80 bg-secondary px-2 py-0.5 rounded-md uppercase tracking-wider">
              Score: {trustScore}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Owes</span>
          <span className={`text-lg font-bold ${risk === 'high' ? 'text-destructive' : 'text-foreground'}`}>SAR {totalDebt.toLocaleString()}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};
