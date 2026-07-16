import React, { useState } from 'react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { TransactionItem } from '../../components/TransactionItem';
import { mockTransactions } from '../../data/mock';

export default function CustomerPaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const filteredTx = mockTransactions.filter(tx => {
    if (filter !== 'all' && tx.status !== filter) return false;
    return true;
  });

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="History" />
      
      <div className="page-scroll px-6 py-4">
        <div className="flex gap-2 mb-6">
          {['all', 'paid', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-[20px] p-4 border border-card-border shadow-sm">
          {filteredTx.length > 0 ? (
            filteredTx.map((tx) => (
              <TransactionItem key={tx.id} {...tx} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground font-medium text-sm">
              No transactions found
            </div>
          )}
        </div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
