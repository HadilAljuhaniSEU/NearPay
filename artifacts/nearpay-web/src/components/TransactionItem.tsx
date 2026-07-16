import React from 'react';
import { CreditCard, Wallet, Apple } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionItemProps {
  merchantName: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export const TransactionItem = ({ merchantName, date, amount, method, status }: TransactionItemProps) => {
  const getIcon = () => {
    if (method.includes('Apple')) return <Apple size={20} />;
    if (method.includes('Tab')) return <Wallet size={20} />;
    return <CreditCard size={20} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3 border-b border-border last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground">{merchantName}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{method} • {new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-sm text-foreground">SAR {amount}</div>
        <div className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${
          status === 'paid' ? 'text-success' : 'text-warning'
        }`}>
          {status}
        </div>
      </div>
    </motion.div>
  );
};
