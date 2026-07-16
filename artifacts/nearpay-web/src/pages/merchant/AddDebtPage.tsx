import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { mockCustomers } from '../../data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export default function AddDebtPage() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Grocery', 'Electronics', 'Clothing', 'Pharmacy', 'Other'];

  const handleNext = () => {
    if (step === 1 && selectedCustomer) setStep(2);
    else if (step === 2 && amount) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setLocation('/merchant/debts');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedCustomer) return;
    
    setIsSuccess(true);
    setTimeout(() => {
      setLocation('/merchant/debts');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="app-container flex flex-col bg-primary items-center justify-center text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <StatusBar />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center relative z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
          >
            <CheckCircle2 size={56} className="text-primary" />
          </motion.div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">Tab Created</h2>
          <p className="text-primary-foreground/90 font-medium text-lg text-center max-w-[250px]">
            SAR {amount} has been added to the customer's tab
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />
      
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-[44px] z-40 bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full -ml-3 hover:bg-secondary text-foreground">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">New Tab</h1>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-primary' : step > i ? 'w-2 bg-primary/40' : 'w-2 bg-border'}`}
            />
          ))}
        </div>
      </div>

      <div className="page-scroll px-6 py-6 pb-32">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Customer */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Select Client</h2>
                <p className="text-muted-foreground">Who are you creating this tab for?</p>
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name or phone..."
                  className="h-14 rounded-2xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary text-base"
                />
              </div>

              <div className="space-y-3">
                {mockCustomers.map(c => (
                  <motion.div 
                    key={c.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { setSelectedCustomer(c.id); setStep(2); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                      selectedCustomer === c.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-card border-card-border hover:border-primary/20'
                    }`}
                  >
                    <Avatar className="h-14 w-14 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {c.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-base">{c.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{c.phone}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-border text-primary font-bold bg-transparent hover:bg-secondary/50">
                + Add New Client
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Enter Amount */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex flex-col items-center justify-center pt-10"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Enter Amount</h2>
                <p className="text-muted-foreground">How much is the tab for?</p>
              </div>
              
              <div className="w-full relative flex items-center justify-center mt-8">
                <span className="absolute left-6 text-2xl font-bold text-muted-foreground">SAR</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-32 text-center text-6xl font-bold rounded-[32px] bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary shadow-inner tracking-tighter"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-3 justify-center w-full mt-4">
                {[50, 100, 200, 500].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-3 bg-card border border-border rounded-xl font-bold text-foreground shadow-sm hover:border-primary/50 transition-colors"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Tab Details</h2>
                <p className="text-muted-foreground">Review and add any final notes.</p>
              </div>

              {/* Summary Card */}
              <div className="bg-card border border-border p-5 rounded-[24px] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {mockCustomers.find(c => c.id === selectedCustomer)?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Client</p>
                    <p className="font-bold text-foreground">{mockCustomers.find(c => c.id === selectedCustomer)?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Amount</p>
                  <p className="font-bold text-xl text-primary">SAR {amount}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Category</label>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        category === cat 
                          ? 'bg-foreground text-background border-foreground shadow-md' 
                          : 'bg-card text-foreground border-border hover:border-foreground/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Due Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                      <Calendar size={18} />
                    </div>
                    <Input
                      type="date"
                      className="pl-11 h-14 rounded-2xl bg-secondary/50 border-0 text-sm font-bold text-foreground"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="time"
                      className="px-4 h-14 rounded-2xl bg-secondary/50 border-0 text-sm font-bold text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Notes</label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-muted-foreground">
                    <FileText size={18} />
                  </div>
                  <Textarea
                    placeholder="Add an optional note about this tab..."
                    className="pl-11 pt-4 min-h-[120px] rounded-2xl bg-secondary/50 border-0 resize-none font-medium text-foreground text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 w-full p-6 bg-background/90 backdrop-blur-xl border-t border-border z-50">
        {step < 3 ? (
          <Button 
            onClick={handleNext}
            disabled={(step === 1 && !selectedCustomer) || (step === 2 && !amount)}
            className="w-full h-14 rounded-[18px] text-lg font-bold shadow-lg hover-elevate gap-2"
          >
            Continue <ChevronRight size={20} />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="w-full h-14 rounded-[18px] text-lg font-bold shadow-lg hover-elevate bg-primary text-primary-foreground"
          >
            Create Tab
          </Button>
        )}
      </div>
    </div>
  );
}