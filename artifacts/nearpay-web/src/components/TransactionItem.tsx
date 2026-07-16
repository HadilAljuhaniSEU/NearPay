import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useT } from '../contexts/LanguageContext';

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
  merchantName,
  customerName,
}: TransactionItemProps) => {
  const t = useT();
  const isPositive = type === 'payment';
  const displayStatus = status === 'paid' ? 'completed' : status;
  const formattedDate = typeof date === 'string' ? format(new Date(date), 'MMM dd, h:mm a') : t('filter_completed');

  const displayName = isPositive
    ? (merchantName ?? t('merchant_label'))
    : (customerName ?? t('customer_label'));

  return (
    <div className="flex items-center justify-between py-2.5 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          isPositive ? 'bg-success/10 text-success' : 'bg-primary/8 text-primary'
        }`}>
          {isPositive ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm leading-tight">{displayName}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            {displayStatus === 'completed' ? (
              <CheckCircle2 size={10} className="text-success" />
            ) : (
              <Clock size={10} className="text-warning" />
            )}
            <span className="font-medium capitalize">{displayStatus}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <div className="text-end flex-shrink-0">
        <p className={`font-bold text-sm ${isPositive ? 'text-success' : 'text-foreground'}`}>
          {isPositive ? '+' : '-'}{t('sar')} {amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
