import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { mockCustomers } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export default function AddDebtPage() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0].id);
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Grocery', 'Electronics', 'Clothing', 'Pharmacy', 'Other'];
  const [category, setCategory] = useState('Grocery');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setIsSuccess(true);
    setTimeout(() => {
      setLocation('/merchant/debts');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="app-container flex flex-col bg-primary items-center justify-center text-primary-foreground">
        <StatusBar />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Tab Added</h2>
          <p className="text-primary-foreground/80 font-medium">SAR {amount} added to customer tab</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />
      
      <div className="px-6 py-4 flex items-center gap-4 sticky top-[44px] z-40 bg-background">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/merchant/dashboard')} className="rounded-full">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">New Tab Entry</h1>
      </div>

      <div className="page-scroll px-6 py-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 text-2xl font-bold text-muted-foreground">SAR</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-20 h-24 text-5xl font-bold rounded-[24px] bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider">Client</label>
              <button type="button" className="text-primary text-sm font-semibold">Add New</button>
            </div>
            
            <div className="space-y-2">
              {mockCustomers.slice(0, 3).map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCustomer(c.id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedCustomer === c.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className={selectedCustomer === c.id ? 'bg-primary text-white' : 'bg-background'}>
                      {c.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                  {selectedCustomer === c.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Details</label>
            
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    category === cat 
                      ? 'bg-foreground text-background border-foreground' 
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                  <Calendar size={18} />
                </div>
                <Input
                  type="date"
                  className="pl-11 h-14 rounded-2xl bg-secondary/50 border-0 text-sm font-medium"
                  defaultValue="2024-11-15"
                />
              </div>
              <div className="relative">
                <Input
                  type="time"
                  className="px-4 h-14 rounded-2xl bg-secondary/50 border-0 text-sm font-medium"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none text-muted-foreground">
                <FileText size={18} />
              </div>
              <Textarea
                placeholder="Add note (optional)"
                className="pl-11 pt-4 min-h-[100px] rounded-2xl bg-secondary/50 border-0 resize-none font-medium"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 w-full p-6 bg-background/90 backdrop-blur-xl border-t border-border">
        <Button 
          onClick={handleSubmit}
          disabled={!amount}
          className="w-full h-14 rounded-[18px] text-lg font-bold shadow-lg hover-elevate"
        >
          Confirm Entry
        </Button>
      </div>
    </div>
  );
}
