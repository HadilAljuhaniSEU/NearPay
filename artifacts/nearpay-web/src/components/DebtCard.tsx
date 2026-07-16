import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface DebtCardProps {
  id: string;
  customerName: string;
  avatar: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'settled';
  category: string;
  role?: 'merchant' | 'customer';
}

export const DebtCard = ({ id, customerName, avatar, amount, dueDate, status, category, role = 'merchant' }: DebtCardProps) => {
  const statusColors = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    overdue: 'bg-destructive/10 text-destructive',
    settled: 'bg-success/10 text-success'
  };

  const statusLabels = {
    pending: 'Pending',
    overdue: 'Overdue',
    settled: 'Settled'
  };

  const linkPath = role === 'merchant' ? `/merchant/debt/${id}` : `/customer/debts`;

  return (
    <Link href={linkPath}>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card border border-card-border rounded-[18px] p-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{customerName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Due {new Date(dueDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-bold text-lg text-foreground tracking-tight">
            SAR {amount}
          </span>
          <Badge variant="outline" className={`border-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[status]}`}>
            {statusLabels[status]}
          </Badge>
        </div>
      </motion.div>
    </Link>
  );
};
