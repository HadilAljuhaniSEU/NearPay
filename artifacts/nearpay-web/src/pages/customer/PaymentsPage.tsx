import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { TransactionItem } from '../../components/TransactionItem';
import { mockTransactions } from '../../data/mock';
import { ReceiptText } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTx = mockTransactions.filter(tx => {
    // Map paid to completed for mock matching if needed
    const txStatus = tx.status === 'paid' ? 'completed' : tx.status;
    if (filter !== 'all' && txStatus !== filter) return false;
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="History" />
      
      <div className="page-scroll px-6 py-4 bg-secondary/20">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mt-4 mx-[-24px] px-6">
          <div className="flex gap-2">
            {['all', 'completed', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex-1 py-2.5 rounded-[16px] text-sm font-bold capitalize transition-all shadow-sm border ${
                  filter === f 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'bg-card text-foreground border-border hover:border-foreground/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-[24px] p-5 border border-border shadow-soft mt-2">
          <AnimatePresence mode="popLayout">
            {filteredTx.length > 0 ? (
              filteredTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={i < filteredTx.length - 1 ? 'border-b border-border mb-4 pb-4' : ''}
                >
                  <TransactionItem {...tx} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                  <ReceiptText size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground">No transactions</h3>
                <p className="text-sm text-muted-foreground mt-1">Your payment history will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-10" />
      </div>

      <BottomNav role="customer" />
    </div>
  );
}