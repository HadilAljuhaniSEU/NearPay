import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export interface TransactionItemProps {
  id: string;
  amount: number;
  date: string | any;
  status: 'paid' | 'pending' | 'failed' | 'completed';
  type?: 'payment' | 'debt';
  merchantName?: string;
  customerName?: string;
}

export const TransactionItem = ({ 
  amount, 
  date, 
  status, 
  type = 'payment',
  merchantName = 'Merchant',
  customerName = 'Customer'
}: TransactionItemProps) => {
  const isPositive = type === 'payment';
  const displayStatus = status === 'paid' ? 'completed' : status;
  
  const formattedDate = typeof date === 'string' ? format(new Date(date), 'MMM dd, h:mm a') : 'Recent';

  return (
    <div className="flex items-center justify-between py-2 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isPositive ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
        }`}>
          {isPositive ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
        </div>
        <div>
          <p className="font-bold text-foreground text-sm">
            {isPositive ? merchantName : customerName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            {displayStatus === 'completed' ? (
              <CheckCircle2 size={10} className="text-success" />
            ) : (
              <Clock size={10} className="text-warning" />
            )}
            <span className="capitalize">{displayStatus}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-sm ${isPositive ? 'text-success' : 'text-foreground'}`}>
          {isPositive ? '+' : '-'}SAR {amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
