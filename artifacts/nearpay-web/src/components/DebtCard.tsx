import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useT } from '../contexts/LanguageContext';

export interface DebtCardProps {
  id: string;
  customerName: string;
  avatar: string;
  amount: number;
  dueDate: any;
  status: 'pending' | 'active' | 'overdue' | 'settled' | 'rejected';
  category?: string;
  role: 'merchant' | 'customer';
}

export const DebtCard = ({ id, customerName, avatar, amount, dueDate, status, role }: DebtCardProps) => {
  const t = useT();
  const isOverdue = status === 'overdue';

  const statusColors = {
    pending:  'bg-warning/10 text-warning border-warning/20',
    active:   'bg-teal/10 text-teal border-teal/20',
    overdue:  'bg-destructive/10 text-destructive border-destructive/20',
    settled:  'bg-secondary text-muted-foreground border-border',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statusLabelKeys = {
    pending:  'status_pending',
    active:   'status_active',
    overdue:  'status_overdue',
    settled:  'status_settled',
    rejected: 'status_rejected',
  } as const;

  const formattedDate = dueDate && dueDate.toDate
    ? format(dueDate.toDate(), 'MMM dd, yyyy')
    : dueDate
    ? format(new Date(dueDate), 'MMM dd, yyyy')
    : t('no_due_date');

  return (
    <Link href={`/${role}/debt/${id}`}>
      <motion.div
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.985 }}
        className="bg-card border border-card-border p-5 rounded-[20px] cursor-pointer flex flex-col gap-4 relative overflow-hidden group"
        style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06), 0 4px 12px rgba(11,35,65,0.04)' }}
      >
        {/* Top accent strip for overdue */}
        {isOverdue && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-destructive/60 rounded-t-[20px]" />
        )}

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border/60">
              <AvatarFallback className={`${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/8 text-primary'} font-bold text-sm`}>
                {avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-foreground text-sm leading-tight">{customerName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                <Calendar size={11} />
                <span>{t('due')} {formattedDate}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status]}`}>
            {t(statusLabelKeys[status])}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
              {t('amount_due')}
            </span>
            <span className={`text-xl font-bold tracking-tight ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
              {t('sar')} {amount.toLocaleString()}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ChevronRight size={16} className="rtl-flip" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
