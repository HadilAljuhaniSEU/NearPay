import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MessageCircle, Phone, Calendar, AlertCircle,
  Copy, Check, Loader2, CreditCard, ChevronRight, X,
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBar } from '../../components/StatusBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useDebt } from '../../hooks/useDebts';
import { useCustomer } from '../../hooks/useCustomers';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchPaymentsForDebt } from '../../services/paymentService';
import { recordPayment } from '../../services/paymentService';
import { PaymentDoc, PaymentMethod } from '../../types';
import { useT } from '../../contexts/LanguageContext';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function buildDebtLink(path: string): string {
  const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
  return `${window.location.origin}${base}/${path}`;
}

const PAYMENT_METHODS: { value: PaymentMethod; labelKey: string }[] = [
  { value: 'cash',          labelKey: 'payment_method_cash' },
  { value: 'card',          labelKey: 'payment_method_card' },
  { value: 'stcpay',        labelKey: 'payment_method_stcpay' },
  { value: 'bank_transfer', labelKey: 'payment_method_transfer' },
];

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-warning/10 text-warning border-warning/20',
  active:   'bg-teal/10 text-teal border-teal/20',
  overdue:  'bg-destructive/10 text-destructive border-destructive/20',
  settled:  'bg-secondary text-muted-foreground border-border',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function DebtDetailPage() {
  const [_, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const t = useT();
  const { merchant } = useAuthContext();

  const { debt, loading: debtLoading }         = useDebt(params.id ?? null);
  const { customer, loading: customerLoading } = useCustomer(debt?.customerId ?? null);

  const [payments, setPayments]           = useState<PaymentDoc[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Payment modal state
  const [showPayModal, setShowPayModal]   = useState(false);
  const [payAmount, setPayAmount]         = useState('');
  const [payMethod, setPayMethod]         = useState<PaymentMethod>('cash');
  const [paying, setPaying]               = useState(false);
  const [payError, setPayError]           = useState('');

  // Copy state
  const [copiedType, setCopiedType] = useState<'approval' | 'payment' | null>(null);

  // Load payment history whenever debt changes
  useEffect(() => {
    if (!debt?.id) return;
    setPaymentsLoading(true);
    fetchPaymentsForDebt(debt.id)
      .then(setPayments)
      .finally(() => setPaymentsLoading(false));
  }, [debt?.id, debt?.updatedAt]);

  // Pre-fill full amount when modal opens
  const openPayModal = () => {
    if (!debt) return;
    setPayAmount(String(debt.remainingAmount));
    setPayError('');
    setShowPayModal(true);
  };

  const handlePay = async () => {
    if (!debt || !customer || !merchant) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0)           { setPayError(t('fill_all_fields')); return; }
    if (amount > debt.remainingAmount)           { setPayError(t('load_failed')); return; }

    setPaying(true);
    setPayError('');
    try {
      await recordPayment({
        debtId:               debt.id,
        merchantId:           merchant.id,
        customerId:           customer.id,
        amount,
        currentRemaining:     debt.remainingAmount,
        currentCustomerPaid:  customer.totalPaid ?? 0,
        paymentMethod:        payMethod,
      });
      setShowPayModal(false);
      // Refresh payment history (debt auto-refreshes via subscription)
      const updated = await fetchPaymentsForDebt(debt.id);
      setPayments(updated);
    } catch {
      setPayError(t('load_failed'));
    } finally {
      setPaying(false);
    }
  };

  const copyLink = async (text: string, type: 'approval' | 'payment') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {}
  };

  const openWhatsApp = (phone: string, message: string) => {
    const clean = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (debtLoading || customerLoading) {
    return (
      <div className="app-container flex flex-col bg-background">
        <StatusBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <span className="text-sm font-medium">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="app-container flex flex-col bg-background">
        <StatusBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <AlertCircle size={40} className="mx-auto text-muted-foreground" />
            <p className="font-bold">{t('debt_not_found')}</p>
            <button onClick={() => setLocation('/merchant/debts')} className="text-sm font-bold" style={{ color: '#20D6C7' }}>
              {t('view_tab')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSettled  = debt.status === 'settled';
  const isOverdue  = debt.status === 'overdue';
  const isRejected = debt.status === 'rejected';

  const createdDateStr  = debt.createdAt ? format(debt.createdAt.toDate(), 'MMM dd, yyyy') : '';
  const dueDateStr      = debt.dueDate   ? format(debt.dueDate.toDate(), 'MMM dd, yyyy')   : '';

  const approvalUrl = buildDebtLink(`debt/approve/${debt.approvalToken}`);
  const paymentUrl  = buildDebtLink(`debt/pay/${debt.paymentToken}`);

  const displayName = customer?.fullName ?? debt.customerName ?? '';
  const displayPhone = customer?.phone  ?? debt.customerPhone ?? '';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/merchant/debts')} className="rounded-full -ms-2 hover:bg-secondary text-foreground">
            <ArrowLeft size={22} className="rtl-flip" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('tab_details')}</h1>
        </div>
      </div>

      <div className="page-scroll">
        {/* ── Customer + Amount Card ── */}
        <div className="px-5 py-6 pb-8 bg-card border-b border-border/40 rounded-b-[28px] relative z-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md mb-4">
              <AvatarFallback className="bg-primary/8 text-primary text-2xl font-bold">
                {displayName ? getInitials(displayName) : '?'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground mb-1">{displayName}</h2>
            {displayPhone && (
              <p className="text-xs font-medium text-muted-foreground mb-6 flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                <Phone size={12} /> {displayPhone}
              </p>
            )}

            {/* Amount card */}
            <div className={`rounded-[28px] p-6 w-full relative overflow-hidden border ${
              isOverdue  ? 'bg-destructive/5 border-destructive/20' :
              isSettled  ? 'bg-secondary/50 border-border' :
              isRejected ? 'bg-destructive/5 border-destructive/20' :
                           'border-teal/20'
            }`} style={!isOverdue && !isSettled && !isRejected ? { background: 'rgba(32,214,199,0.06)' } : {}}>
              <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                {isSettled ? t('settled_amount') : t('amount_due')}
              </p>
              <h3 className={`text-5xl font-bold tracking-tighter mb-1 ${isOverdue || isRejected ? 'text-destructive' : 'text-foreground'}`}>
                {t('sar')} {debt.remainingAmount}
              </h3>
              {!isSettled && debt.amount !== debt.remainingAmount && (
                <p className="text-xs text-muted-foreground font-medium mb-4">
                  {t('remaining_label')} / {t('sar')} {debt.amount} {t('original_amount_label')}
                </p>
              )}
              {(isSettled || debt.amount === debt.remainingAmount) && <div className="mb-4" />}
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline" className={`rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] border ${STATUS_COLORS[debt.status] ?? ''}`}>
                  {t(`status_${debt.status}` as any)}
                </Badge>
                {debt.description && (
                  <Badge variant="outline" className="rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] bg-background border-border">
                    {debt.description}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick actions: WhatsApp + Call */}
            {displayPhone && (
              <div className="flex w-full gap-3 mt-5">
                <Button variant="outline"
                  className="flex-1 rounded-2xl h-13 gap-2 border-border/60 font-bold bg-background hover:bg-secondary text-foreground text-sm"
                  onClick={() => openWhatsApp(displayPhone, `${t('whatsapp')}: ${approvalUrl}`)}>
                  <MessageCircle size={18} style={{ color: '#25D366' }} /> {t('whatsapp')}
                </Button>
                <Button variant="outline"
                  className="flex-1 rounded-2xl h-13 gap-2 border-border/60 font-bold bg-background hover:bg-secondary text-foreground text-sm"
                  onClick={() => window.open(`tel:${displayPhone.replace(/\D/g, '')}`)}>
                  <Phone size={18} className="text-teal" /> {t('call')}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* ── Share Links ── */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('share_links')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 p-5 shadow-sm space-y-4">
              {/* Approval */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground">{t('approval_link_label')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => copyLink(approvalUrl, 'approval')}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-border/60 transition-colors">
                      {copiedType === 'approval' ? <><Check size={12} /> {t('link_copied')}</> : <><Copy size={12} /> {t('copy_link')}</>}
                    </button>
                    <button onClick={() => openWhatsApp(displayPhone, approvalUrl)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                      <MessageCircle size={12} /> WA
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium truncate bg-secondary/50 px-3 py-1.5 rounded-lg">{approvalUrl}</p>
              </div>
              <div className="h-px bg-border/60" />
              {/* Payment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground">{t('payment_link_label')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => copyLink(paymentUrl, 'payment')}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-border/60 transition-colors">
                      {copiedType === 'payment' ? <><Check size={12} /> {t('link_copied')}</> : <><Copy size={12} /> {t('copy_link')}</>}
                    </button>
                    <button onClick={() => openWhatsApp(displayPhone, paymentUrl)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                      <MessageCircle size={12} /> WA
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium truncate bg-secondary/50 px-3 py-1.5 rounded-lg">{paymentUrl}</p>
              </div>
            </div>
          </div>

          {/* ── Tab Details ── */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('tab_information')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <Calendar size={15} />
                  </div>
                  <span className="font-semibold text-sm">{t('created_date')}</span>
                </div>
                <span className="font-bold text-foreground text-sm">{createdDateStr}</span>
              </div>
              {dueDateStr && (
                <>
                  <div className="h-px bg-border/60" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                        <AlertCircle size={15} />
                      </div>
                      <span className="font-semibold text-sm text-muted-foreground">{t('due_date')}</span>
                    </div>
                    <span className={`font-bold text-sm ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>{dueDateStr}</span>
                  </div>
                </>
              )}
              {debt.description && (
                <>
                  <div className="h-px bg-border/60" />
                  <div className="flex justify-between items-start pt-1">
                    <span className="font-semibold text-sm text-muted-foreground min-w-20 pt-0.5">{t('notes_label')}</span>
                    <span className="font-medium text-sm text-foreground text-end leading-relaxed">{debt.description}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Activity Timeline ── */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('activity_history')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 p-5 shadow-sm">
              <div className="space-y-5 relative before:absolute before:inset-0 before:ms-[15px] before:w-0.5 before:bg-border/50">
                {isOverdue && (
                  <div className="relative ps-9">
                    <div className="absolute start-[11px] top-1 w-2.5 h-2.5 rounded-full bg-destructive ring-4 ring-card" />
                    <p className="font-bold text-sm text-destructive mb-0.5">{t('marked_overdue')}</p>
                    <p className="text-xs text-muted-foreground font-medium">{dueDateStr} · {t('automated_update')}</p>
                  </div>
                )}
                {payments.map((p) => (
                  <div key={p.id} className="relative ps-9">
                    <div className="absolute start-[11px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-card bg-teal" />
                    <p className="font-bold text-sm text-foreground mb-0.5">{t('payment_entry')} · {t('sar')} {p.amount}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {p.createdAt ? format(p.createdAt.toDate(), 'MMM dd, yyyy') : ''} · {p.paymentMethod}
                    </p>
                  </div>
                ))}
                <div className="relative ps-9">
                  <div className="absolute start-[11px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-card" style={{ background: '#20D6C7' }} />
                  <p className="font-bold text-sm text-foreground mb-0.5">{t('initial_entry')}</p>
                  <p className="text-xs text-muted-foreground font-medium">{createdDateStr}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Payment History ── */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('payment_history_section')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 shadow-sm overflow-hidden">
              {paymentsLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : payments.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">{t('no_payments_yet')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {payments.map((p, i) => (
                    <div key={p.id} className={`flex items-center justify-between px-5 py-4 ${i === 0 ? '' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center">
                          <CreditCard size={16} className="text-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{p.paymentMethod}</p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {p.createdAt ? format(p.createdAt.toDate(), 'MMM dd, yyyy') : ''}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-sm" style={{ color: '#20D6C7' }}>+{t('sar')} {p.amount}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-28" />
        </div>
      </div>

      {/* ── Record Payment Button ── */}
      {!isSettled && !isRejected && (
        <div className="absolute bottom-0 w-full p-5 bg-background/90 backdrop-blur-xl border-t border-border/30 z-50">
          <Button onClick={openPayModal} className="w-full h-14 rounded-[18px] text-base font-bold gap-2">
            <CreditCard size={19} /> {t('record_payment')}
          </Button>
        </div>
      )}

      {/* ── Payment Modal ── */}
      <AnimatePresence>
        {showPayModal && (
          <>
            <motion.div key="backdrop"
              className="fixed inset-0 bg-black/50 z-[60]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)} />
            <motion.div key="modal"
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[28px] border-t border-border/60 z-[61]"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">{t('record_payment')}</h2>
                  <button onClick={() => setShowPayModal(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>

                {/* Remaining amount hint */}
                <div className="bg-secondary/60 rounded-[18px] px-4 py-3 flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{t('remaining_label')}</span>
                  <span className="font-bold text-sm text-foreground">{t('sar')} {debt.remainingAmount}</span>
                </div>

                {/* Amount input */}
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-muted-foreground font-bold text-sm pointer-events-none">{t('sar')}</span>
                  <Input type="number" value={payAmount} min={1} max={debt.remainingAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="ps-14 h-14 rounded-[18px] text-xl font-bold bg-secondary/50 border-0 focus-visible:ring-2 tracking-tight"
                    style={{ '--tw-ring-color': '#20D6C7' } as any} />
                  <button onClick={() => setPayAmount(String(debt.remainingAmount))}
                    className="absolute inset-y-0 end-0 flex items-center pe-4 text-xs font-bold"
                    style={{ color: '#20D6C7' }}>
                    {t('full_payment_btn')}
                  </button>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.value} onClick={() => setPayMethod(m.value)}
                      className={`h-12 rounded-[14px] font-bold text-sm border-2 transition-all ${
                        payMethod === m.value
                          ? 'border-teal text-foreground'
                          : 'border-transparent bg-secondary/70 text-muted-foreground hover:text-foreground'
                      }`}
                      style={payMethod === m.value ? { background: 'rgba(32,214,199,0.08)' } : {}}>
                      {t(m.labelKey as any)}
                    </button>
                  ))}
                </div>

                {payError && (
                  <div className="mb-3 p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                    <p className="text-sm font-semibold text-destructive text-center">{payError}</p>
                  </div>
                )}

                <Button onClick={handlePay}
                  disabled={!payAmount || parseFloat(payAmount) <= 0 || paying}
                  className="w-full h-14 rounded-[18px] font-bold text-base gap-2">
                  {paying ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <><CreditCard size={18} /> {t('confirm_payment_btn')} {payAmount ? `· ${t('sar')} ${payAmount}` : ''}</>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
