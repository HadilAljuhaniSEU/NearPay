import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface DebtCardProps {
  id: string;
  customerName: string;
  avatar: string;
  amount: number;
  dueDate: any; // Firebase Timestamp or Date
  status: 'pending' | 'active' | 'overdue' | 'settled' | 'rejected';
  category?: string;
  role: 'merchant' | 'customer';
}

export const DebtCard = ({ id, customerName, avatar, amount, dueDate, status, role }: DebtCardProps) => {
  const isOverdue = status === 'overdue';
  
  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    active: 'bg-primary/10 text-primary border-primary/20',
    overdue: 'bg-destructive/10 text-destructive border-destructive/20',
    settled: 'bg-secondary text-muted-foreground border-border',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statusLabels = {
    pending: 'Pending',
    active: 'Active',
    overdue: 'Overdue',
    settled: 'Settled',
    rejected: 'Rejected',
  };

  const formattedDate = dueDate && dueDate.toDate ? format(dueDate.toDate(), 'MMM dd, yyyy') : dueDate ? format(new Date(dueDate), 'MMM dd, yyyy') : 'No due date';

  return (
    <Link href={`/${role}/debt/${id}`}>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card border border-card-border p-5 rounded-[20px] shadow-soft cursor-pointer flex flex-col gap-4 relative overflow-hidden group"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarFallback className={`${isOverdue ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary'} font-bold`}>
                {avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-foreground">{customerName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
                <Calendar size={12} />
                <span>Due {formattedDate}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-semibold border ${statusColors[status]}`}>
            {statusLabels[status]}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Amount Due</span>
            <span className={`text-xl font-bold tracking-tight ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
              SAR {amount.toLocaleString()}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ChevronRight size={16} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
