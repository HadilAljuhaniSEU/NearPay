import React from 'react';
import { Phone, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { useT } from '../contexts/LanguageContext';

export interface CustomerCardProps {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  totalDebt: number;
  trustScore: number;
  risk: 'low' | 'medium' | 'high';
}

export const CustomerCard = ({ name, phone, avatar, totalDebt, trustScore, risk, onClick }: CustomerCardProps & { onClick?: () => void }) => {
  const t = useT();

  const riskLabelKeys = {
    low:    'risk_low',
    medium: 'risk_medium',
    high:   'risk_high',
  } as const;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="bg-card border border-card-border p-5 rounded-[20px] cursor-pointer flex items-center justify-between gap-4 group"
      style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06), 0 4px 12px rgba(11,35,65,0.04)' }}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="h-13 w-13 border border-border/60">
            <AvatarFallback className="bg-primary/8 text-primary font-bold text-base">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -end-0.5 bg-card rounded-full p-0.5 shadow-sm">
            {risk === 'low' ? (
              <ShieldCheck size={14} className="text-success" />
            ) : (
              <AlertTriangle size={14} className={risk === 'high' ? 'text-destructive' : 'text-warning'} />
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-foreground text-sm leading-tight">{name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Phone size={11} />
            <span className="font-medium">{phone}</span>
          </div>
          <div className="mt-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
              risk === 'low'    ? 'bg-success/10 text-success' :
              risk === 'medium' ? 'bg-warning/10 text-warning' :
                                  'bg-destructive/10 text-destructive'
            }`}>
              {t(riskLabelKeys[risk])}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex flex-col items-end text-end">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">
            {t('owes')}
          </span>
          <span className={`text-base font-bold ${risk === 'high' ? 'text-destructive' : 'text-foreground'}`}>
            {t('sar')} {totalDebt.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
            {t('score_label')} {trustScore}
          </span>
        </div>
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <ChevronRight size={14} className="rtl-flip" />
        </div>
      </div>
    </motion.div>
  );
};
