import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, FileText, CheckCircle2, ChevronRight,
  Search, Copy, Check, MessageCircle,
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { StatusBar } from '../../components/StatusBar';
import { AddCustomerSheet } from '../../components/AddCustomerSheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCustomers } from '../../hooks/useCustomers';
import { createDebt } from '../../services/debtService';
import { updateCustomer } from '../../services/customerService';
import { updateMerchantAggregates } from '../../services/merchantService';
import { CustomerDoc, DebtStatus, ApprovalStatus, PaymentType } from '../../types';
import { useT } from '../../contexts/LanguageContext';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function buildDebtLink(path: string): string {
  const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
  return `${window.location.origin}${base}/${path}`;
}

const CATEGORIES = [
  { key: 'cat_grocery',     id: 'Grocery' },
  { key: 'cat_electronics', id: 'Electronics' },
  { key: 'cat_clothing',    id: 'Clothing' },
  { key: 'cat_pharmacy',    id: 'Pharmacy' },
  { key: 'cat_other',       id: 'Other' },
] as const;

export default function AddDebtPage() {
  const [_, setLocation] = useLocation();
  const { merchant } = useAuthContext();
  const { customers, loading: customersLoading } = useCustomers(merchant?.id ?? null);
  const t = useT();

  const [step, setStep]                     = useState<1 | 2 | 3>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDoc | null>(null);
  const [search, setSearch]                 = useState('');
  const [amount, setAmount]                 = useState('');
  const [description, setDescription]       = useState('');
  const [category, setCategory]             = useState('');
  const [dueDate, setDueDate]               = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [submitError, setSubmitError]       = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [copiedType, setCopiedType]         = useState<'approval' | 'payment' | null>(null);

  // Set after successful creation
  const [createdLinks, setCreatedLinks] = useState<{ approvalToken: string; paymentToken: string } | null>(null);

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
    else setLocation('/merchant/debts');
  };

  const handleCustomerSelect = (c: CustomerDoc) => {
    setSelectedCustomer(c);
    setStep(2);
  };

  const handleCustomerCreated = (c: CustomerDoc) => {
    setShowAddCustomer(false);
    setSelectedCustomer(c);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!merchant || !selectedCustomer || !amount) return;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setSubmitError('');
    setSubmitting(true);
    try {
      const dueDateTs = dueDate
        ? Timestamp.fromDate(new Date(dueDate + 'T12:00:00'))
        : null;

      const { approvalToken, paymentToken } = await createDebt({
        merchantId:      merchant.id,
        merchantName:    merchant.name,
        customerId:      selectedCustomer.id,
        customerName:    selectedCustomer.fullName,
        customerPhone:   selectedCustomer.phone,
        amount:          amountNum,
        remainingAmount: amountNum,
        description:     description.trim(),
        status:          'pending' as DebtStatus,
        paymentType:     'flexible' as PaymentType,
        dueDate:         dueDateTs,
        approvalStatus:  'pending' as ApprovalStatus,
      });

      // Update merchant outstanding
      await updateMerchantAggregates(merchant.id, { totalOutstandingDelta: amountNum });

      // Update customer totalDebt
      await updateCustomer(selectedCustomer.id, {
        totalDebt: (selectedCustomer.totalDebt || 0) + amountNum,
      });

      setCreatedLinks({ approvalToken, paymentToken });
    } catch (err) {
      console.error(err);
      setSubmitError(t('load_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async (text: string, type: 'approval' | 'payment') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {}
  };

  const openWhatsApp = (phone: string, link: string, type: 'approval' | 'payment') => {
    const msg = type === 'approval'
      ? `${t('approval_link_hint')}: ${link}`
      : `${t('payment_link_hint')}: ${link}`;
    const clean = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Success screen ────────────────────────────────────────────────────────────
  if (createdLinks) {
    const approvalUrl = buildDebtLink(`debt/approve/${createdLinks.approvalToken}`);
    const paymentUrl  = buildDebtLink(`debt/pay/${createdLinks.paymentToken}`);

    return (
      <div className="app-container flex flex-col bg-background">
        <StatusBar />
        <div className="px-5 py-4 flex items-center sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/30">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('tab_created')}</h1>
        </div>

        <div className="page-scroll px-5 py-6 pb-32 space-y-5">
          {/* Success banner */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 border-background shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #20D6C7, #0FB8A9)' }}>
              <CheckCircle2 size={38} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{t('tab_created')}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {t('tab_created_desc', amount, selectedCustomer?.fullName ?? '')}
            </p>
          </motion.div>

          {/* Links desc */}
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">{t('debt_links_desc')}</p>

          {/* Approval Link */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card rounded-[22px] border border-border/60 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('approval_link_label')}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">{approvalUrl}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(32,214,199,0.10)' }}>
                <FileText size={18} style={{ color: '#20D6C7' }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{t('approval_link_hint')}</p>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl h-10 font-bold gap-2 border-border/60 text-sm"
                onClick={() => copyLink(approvalUrl, 'approval')}>
                {copiedType === 'approval' ? <><Check size={15} /> {t('link_copied')}</> : <><Copy size={15} /> {t('copy_link')}</>}
              </Button>
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl h-10 font-bold gap-2 border-border/60 text-sm"
                onClick={() => openWhatsApp(selectedCustomer?.phone ?? '', approvalUrl, 'approval')}
                style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}>
                <MessageCircle size={15} /> {t('whatsapp')}
              </Button>
            </div>
          </motion.div>

          {/* Payment Link */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="bg-card rounded-[22px] border border-border/60 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('payment_link_label')}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">{paymentUrl}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(32,214,199,0.10)' }}>
                <Calendar size={18} style={{ color: '#20D6C7' }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{t('payment_link_hint')}</p>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl h-10 font-bold gap-2 border-border/60 text-sm"
                onClick={() => copyLink(paymentUrl, 'payment')}>
                {copiedType === 'payment' ? <><Check size={15} /> {t('link_copied')}</> : <><Copy size={15} /> {t('copy_link')}</>}
              </Button>
              <Button variant="outline" size="sm"
                className="flex-1 rounded-xl h-10 font-bold gap-2 border-border/60 text-sm"
                onClick={() => openWhatsApp(selectedCustomer?.phone ?? '', paymentUrl, 'payment')}
                style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}>
                <MessageCircle size={15} /> {t('whatsapp')}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full p-5 bg-background/90 backdrop-blur-xl border-t border-border/30 z-50">
          <Button className="w-full h-14 rounded-[18px] text-base font-bold" onClick={() => setLocation('/merchant/debts')}>
            {t('view_tab')}
          </Button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────────
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
          {([1, 2, 3] as const).map(i => (
            <div key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-7' : step > i ? 'w-2' : 'w-2 bg-border'}`}
              style={step === i ? { background: 'linear-gradient(90deg, #20D6C7, #0FB8A9)' } : step > i ? { background: 'rgba(32,214,199,0.4)' } : {}}
            />
          ))}
        </div>
      </div>

      <div className="page-scroll px-5 py-6 pb-32">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Select Customer ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold">{t('step_select_client')}</h2>

              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
                  <Search size={17} />
                </div>
                <Input
                  type="text"
                  placeholder={t('search_customer')}
                  className="ps-11 h-12 rounded-2xl bg-card border border-border/60 text-sm font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* List */}
              <div className="space-y-3">
                {customersLoading ? (
                  [1,2,3].map(i => (
                    <div key={i} className="h-[72px] rounded-[18px] bg-card border border-border/40 animate-pulse" />
                  ))
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <motion.div key={c.id} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleCustomerSelect(c)}
                      className={`flex items-center gap-4 p-4 rounded-[18px] border-2 transition-all cursor-pointer ${
                        selectedCustomer?.id === c.id
                          ? 'border-teal bg-teal/5'
                          : 'border-transparent bg-card hover:border-border'
                      }`}
                      style={{ boxShadow: '0 1px 3px rgba(11,35,65,0.06)' }}>
                      <Avatar className="h-12 w-12 border border-border/60">
                        <AvatarFallback className="bg-primary/8 text-primary font-bold text-base">
                          {getInitials(c.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm truncate">{c.fullName}</h3>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{c.phone}</p>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground rtl-flip flex-shrink-0" />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground font-medium py-8">{t('no_customers_yet')}</p>
                )}
              </div>

              {/* Add New Customer */}
              <Button variant="outline"
                className="w-full h-13 rounded-[18px] border-dashed border-2 font-bold bg-transparent"
                style={{ color: '#20D6C7', borderColor: 'rgba(32,214,199,0.4)' }}
                onClick={() => setShowAddCustomer(true)}>
                {t('add_new_client')}
              </Button>
            </motion.div>
          )}

          {/* ── Step 2: Enter Amount ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex flex-col items-center pt-8">
              <div className="text-center">
                <h2 className="text-xl font-bold">{t('step_enter_amount')}</h2>
              </div>
              <div className="w-full relative flex items-center justify-center mt-4">
                <span className="absolute start-6 text-xl font-bold text-muted-foreground">{t('sar')}</span>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="h-28 text-center text-5xl font-bold rounded-[28px] bg-secondary/50 border-0 focus-visible:ring-2 tracking-tighter"
                  style={{ '--tw-ring-color': '#20D6C7' } as any}
                  placeholder="0" autoFocus min={1} />
              </div>
              <div className="flex gap-3 w-full">
                {[50, 100, 200, 500].map(val => (
                  <button key={val} onClick={() => setAmount(val.toString())}
                    className="flex-1 py-3 bg-card border border-border/60 rounded-xl font-bold text-sm text-foreground hover:border-teal/50 transition-colors shadow-sm">
                    +{val}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Details ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold">{t('step_tab_details')}</h2>

              {/* Summary Card */}
              <div className="bg-card border border-border/60 p-5 rounded-[22px] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border/60">
                    <AvatarFallback className="bg-primary/8 text-primary font-bold">
                      {selectedCustomer ? getInitials(selectedCustomer.fullName) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{t('client_name')}</p>
                    <p className="font-bold text-foreground text-sm">{selectedCustomer?.fullName}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">{t('tab_amount')}</p>
                  <p className="font-bold text-lg" style={{ color: '#20D6C7' }}>{t('sar')} {amount}</p>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_category')}</label>
                <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        category === cat.id
                          ? 'bg-foreground text-background border-foreground shadow-sm'
                          : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                      }`}>
                      {t(cat.key)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_due_date')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
                    <Calendar size={17} />
                  </div>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="ps-11 h-13 rounded-[18px] bg-secondary/50 border-0 text-sm font-bold text-foreground" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ps-1">{t('tab_notes')}</label>
                <div className="relative">
                  <div className="absolute top-4 start-4 pointer-events-none text-muted-foreground">
                    <FileText size={17} />
                  </div>
                  <Textarea placeholder={t('tab_notes')} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="ps-11 pt-4 min-h-[110px] rounded-[18px] bg-secondary/50 border-0 resize-none font-medium text-foreground text-sm" />
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                  <p className="text-sm font-semibold text-destructive text-center">{submitError}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 w-full p-5 bg-background/90 backdrop-blur-xl border-t border-border/30 z-50">
        {step < 3 ? (
          <Button onClick={() => setStep((step + 1) as 2 | 3)}
            disabled={(step === 1 && !selectedCustomer) || (step === 2 && (!amount || parseFloat(amount) <= 0))}
            className="w-full h-14 rounded-[18px] text-base font-bold gap-2">
            {t('continue_btn')} <ChevronRight size={18} className="rtl-flip" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}
            disabled={!amount || !selectedCustomer || submitting}
            className="w-full h-14 rounded-[18px] text-base font-bold">
            {submitting ? (
              <div className="flex gap-1.5">
                {[0,150,300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            ) : t('create_tab_btn')}
          </Button>
        )}
      </div>

      {/* Add Customer Sheet */}
      {merchant && (
        <AddCustomerSheet
          merchantId={merchant.id}
          open={showAddCustomer}
          onClose={() => setShowAddCustomer(false)}
          onCreated={handleCustomerCreated}
        />
      )}
    </div>
  );
}
