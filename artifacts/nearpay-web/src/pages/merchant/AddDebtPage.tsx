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
import { useT } from '../../contexts/LanguageContext';

export default function AddDebtPage() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useT();

  const categoryKeys = [
    { key: 'cat_grocery', id: 'Grocery' },
    { key: 'cat_electronics', id: 'Electronics' },
    { key: 'cat_clothing', id: 'Clothing' },
    { key: 'cat_pharmacy', id: 'Pharmacy' },
    { key: 'cat_other', id: 'Other' },
  ] as const;

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
    setTimeout(() => setLocation('/merchant/debts'), 2200);
  };

  const selectedName = mockCustomers.find((c) => c.id === selectedCustomer)?.name ?? '';

  if (isSuccess) {
    return (
      <div className="app-container flex flex-col items-center justify-center text-white relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 end-0 w-64 h-64 rounded-full blur-3xl opacity-20"
               style={{ background: 'radial-gradient(circle, #2ED8C3, transparent)' }} />
          <div className="absolute bottom-0 start-0 w-64 h-64 rounded-full blur-3xl opacity-10"
               style={{ background: 'radial-gradient(circle, #19B8D3, transparent)' }} />
        </div>
        <StatusBar />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.45 }}
          className="flex flex-col items-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
          >
            <CheckCircle2 size={52} style={{ color: '#2ED8C3' }} />
          </motion.div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">{t('tab_created')}</h2>
          <p className="text-white/80 font-medium text-base text-center max-w-[240px]">
            {t('tab_created_desc', amount, selectedName)}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col bg-background relative">
      <StatusBar />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full -ms-2 hover:bg-secondary text-foreground">
            <ArrowLeft size={22} className="rtl-flip" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('add_debt_title')}</h1>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? 'w-7' : step > i ? 'w-2' : 'w-2 bg-border'
              }`}
              style={step === i ? { background: 'linear-gradient(90deg, #2ED8C3, #19B8D3)' } :
                     step > i ? { background: 'rgba(46,216,195,0.4)' } : {}}
            />
          ))}
        </div>
      </div>

      <div className="page-scroll px-5 py-6 pb-32">
        <AnimatePresence mode="wait">

          {/* STEP 1: Select Customer */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">{t('step_select_client')}</h2>
              </div>

              <div className="space-y-3">
                {mockCustomers.map(c => (
                  <motion.div
                    key={c.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedCustomer(c.id); setStep(2); }}
                    className={`flex items-center gap-4 p-4 rounded-[18px] border-2 transition-all cursor-pointer ${
                      selectedCustomer === c.id
                        ? 'border-teal bg-teal/5'
                        : 'border-transparent bg-card hover:border-border'
                    }`}
                    style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06)' }}
                  >
                    <Avatar className="h-13 w-13 border border-border/60">
                      <AvatarFallback className="bg-primary/8 text-primary font-bold text-base">
                        {c.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-sm">{c.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{c.phone}</p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground rtl-flip" />
                  </motion.div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full h-13 rounded-[18px] border-dashed border-2 border-border font-bold bg-transparent hover:bg-secondary/50"
                style={{ color: '#2ED8C3', borderColor: 'rgba(46,216,195,0.4)' }}
              >
                {t('add_new_client')}
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
              className="space-y-8 flex flex-col items-center pt-8"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold mb-1">{t('step_enter_amount')}</h2>
              </div>

              <div className="w-full relative flex items-center justify-center mt-4">
                <span className="absolute start-6 text-xl font-bold text-muted-foreground">{t('sar')}</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-28 text-center text-5xl font-bold rounded-[28px] bg-secondary/50 border-0 focus-visible:ring-2 tracking-tighter"
                  style={{ '--tw-ring-color': '#2ED8C3' } as any}
                  placeholder="0"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 w-full">
                {[50, 100, 200, 500].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-3 bg-card border border-border/60 rounded-xl font-bold text-sm text-foreground hover:border-teal/50 transition-colors shadow-sm"
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
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">{t('step_tab_details')}</h2>

              {/* Summary Card */}
              <div className="bg-card border border-border/60 p-5 rounded-[22px] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border/60">
                    <AvatarFallback className="bg-primary/8 text-primary font-bold">
                      {mockCustomers.find(c => c.id === selectedCustomer)?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{t('client_name')}</p>
                    <p className="font-bold text-foreground text-sm">{selectedName}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{t('tab_amount')}</p>
                  <p className="font-bold text-lg" style={{ color: '#2ED8C3' }}>{t('sar')} {amount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_category')}</label>
                <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                  {categoryKeys.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        category === cat.id
                          ? 'bg-foreground text-background border-foreground shadow-sm'
                          : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                      }`}
                    >
                      {t(cat.key)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_due_date')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
                    <Calendar size={17} />
                  </div>
                  <Input type="date" className="pl-11 h-13 rounded-[18px] bg-secondary/50 border-0 text-sm font-bold text-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_notes')}</label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-muted-foreground">
                    <FileText size={17} />
                  </div>
                  <Textarea
                    placeholder={t('tab_notes')}
                    className="pl-11 pt-4 min-h-[110px] rounded-[18px] bg-secondary/50 border-0 resize-none font-medium text-foreground text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 w-full p-5 bg-background/90 backdrop-blur-xl border-t border-border/30 z-50">
        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={(step === 1 && !selectedCustomer) || (step === 2 && !amount)}
            className="w-full h-14 rounded-[18px] text-base font-bold gap-2"
          >
            {t('continue_btn')} <ChevronRight size={18} className="rtl-flip" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="w-full h-14 rounded-[18px] text-base font-bold"
          >
            {t('create_tab_btn')}
          </Button>
        )}
      </div>
    </div>
  );
}
