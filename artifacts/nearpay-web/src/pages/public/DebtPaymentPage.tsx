import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, DollarSign, Hash, Receipt } from 'lucide-react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByPaymentToken } from '../../services/debtService';
import { recordPayment, fetchPaymentsForDebt } from '../../services/paymentService';
import { auth } from '../../lib/firebase';
import { DebtDoc, PaymentDoc, PaymentMethod } from '../../types';
import { useT } from '../../contexts/LanguageContext';
import { format } from 'date-fns';

/*
 * TODO: Integrate Mada payment gateway (madapay.com)
 * TODO: Integrate Apple Pay (iOS) via Apple Pay JS API
 * TODO: Integrate Google Pay (Android) via Google Pay API
 * TODO: Integrate STC Pay via STC Pay SDK
 * Replace the simulated payment flow below once credentials are available.
 */

type PageState = 'auth_check' | 'loading' | 'ready' | 'paying' | 'paid' | 'already_paid' | 'error';
type PayMode   = 'full' | 'half' | 'custom';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; dot: string }[] = [
  { value: 'cash',          label: 'Cash',              dot: '#10B981' },
  { value: 'card',          label: 'Mada / Credit Card', dot: '#16A34A' },
  { value: 'stcpay',        label: 'STC Pay',            dot: '#4F008C' },
  { value: 'bank_transfer', label: 'Bank Transfer',      dot: '#3B82F6' },
];

export default function DebtPaymentPage() {
  const params = useParams<{ token: string }>();
  const token  = params.token;
  const t      = useT();
  const [_, setLocation] = useLocation();

  const [debt,     setDebt]     = useState<DebtDoc | null>(null);
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [state,    setState]    = useState<PageState>('auth_check');
  const [errorMsg, setErrorMsg] = useState('');
  const [method,   setMethod]   = useState<PaymentMethod>('cash');
  const [payMode,  setPayMode]  = useState<PayMode>('full');
  const [customAmt, setCustomAmt] = useState('');

  // ── Step 1: verify customer is authenticated ──────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      unsub();
      if (!user) {
        setLocation(`/customer/otp?redirect=${encodeURIComponent(`/debt/pay/${token}`)}`);
      } else {
        setState('loading');
      }
    });
    return unsub;
  }, [token]);

  // ── Step 2: load debt + payment history ──────────────────────────────────
  useEffect(() => {
    if (state !== 'loading') return;
    if (!token) { setState('error'); setErrorMsg(t('invalid_link')); return; }

    fetchDebtByPaymentToken(token)
      .then((d) => {
        if (!d) { setState('error'); setErrorMsg(t('link_expired')); return; }
        if (d.status === 'settled')            { setDebt(d); setState('already_paid'); return; }
        if (d.approvalStatus === 'pending')    { setState('error'); setErrorMsg(t('not_approved_yet')); return; }
        if (d.approvalStatus === 'rejected')   { setState('error'); setErrorMsg(t('debt_rejected')); return; }
        if (d.approvalStatus === 'disputed')   { setState('error'); setErrorMsg(t('debt_rejected')); return; }
        setDebt(d);
        setState('ready');
        fetchPaymentsForDebt(d.id).then(setPayments).catch(() => {});
      })
      .catch(() => { setState('error'); setErrorMsg(t('load_failed')); });
  }, [state, token]);

  // ── Derived payment amount ────────────────────────────────────────────────
  const payAmount = useMemo(() => {
    if (!debt) return 0;
    if (payMode === 'full') return debt.remainingAmount;
    if (payMode === 'half') return Math.ceil(debt.remainingAmount / 2);
    const n = parseFloat(customAmt.replace(/,/g, ''));
    return isNaN(n) ? 0 : n;
  }, [debt, payMode, customAmt]);

  const isValid  = debt ? payAmount > 0 && payAmount <= debt.remainingAmount : false;
  const amtError = useMemo(() => {
    if (!debt || payMode !== 'custom' || !customAmt) return '';
    if (payAmount > debt.remainingAmount) return t('amount_exceeds');
    if (payAmount <= 0) return t('amount_invalid');
    return '';
  }, [debt, payMode, customAmt, payAmount]);

  const minPayment = debt
    ? Math.min(debt.remainingAmount, Math.max(100, Math.ceil(debt.remainingAmount * 0.1)))
    : 0;

  // ── Pay handler (simulated — no real gateway yet) ────────────────────────
  const handlePay = async () => {
    if (!debt || !isValid) return;
    setState('paying');
    try {
      await recordPayment({
        debtId:              debt.id,
        merchantId:          debt.merchantId,
        customerId:          debt.customerId,
        amount:              payAmount,
        currentRemaining:    debt.remainingAmount,
        currentCustomerPaid: 0,
        paymentMethod:       method,
        dueDate:             debt.dueDate,
      });
      setState('paid');
    } catch {
      setState('error');
      setErrorMsg(t('payment_failed'));
    }
  };

  return (
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      {/* Status bar */}
      <div className="h-11 w-full px-5 flex items-center justify-between z-50 text-foreground pointer-events-none">
        <span className="text-[14px] font-bold tracking-tight">9:41</span>
        <div className="flex gap-1.5 opacity-50">
          <div className="w-3.5 h-3.5 rounded-full bg-current" />
          <div className="w-3.5 h-3.5 rounded-full bg-current" />
          <div className="w-5 h-3.5 rounded-sm bg-current" />
        </div>
      </div>

      <div className="absolute top-0 end-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.06), transparent)' }} />

      <div className="flex-1 flex flex-col px-5 py-4 pb-10 overflow-y-auto relative z-10">
        <div className="mb-6 flex justify-center">
          <NearPayLogo size={32} />
        </div>

        <AnimatePresence mode="wait">

          {/* ── Loading / paying ── */}
          {(state === 'auth_check' || state === 'loading' || state === 'paying') && (
            <motion.div key="loading"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="bg-card border border-border/60 rounded-[28px] p-10 flex flex-col items-center gap-5 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t('processing')}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {state === 'paying' ? t('processing_payment') : t('loading_tab_details')}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Ready: payment form ── */}
          {state === 'ready' && debt && (
            <motion.div key="ready"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5">

              {/* Hero card */}
              <div className="rounded-[24px] p-6 text-white relative overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.25)' }}>
                <div className="absolute top-0 start-0 w-40 h-40 rounded-full blur-3xl -ms-10 -mt-10 pointer-events-none"
                     style={{ background: 'rgba(32,214,199,0.15)' }} />
                <div className="relative z-10">
                  {debt.referenceNumber && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Hash size={11} className="text-white/40" />
                      <span className="text-[11px] font-bold text-white/50 font-mono tracking-wider">{debt.referenceNumber}</span>
                    </div>
                  )}
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('amount_due')}</p>
                  <h3 className="text-4xl font-bold tracking-tighter mb-1">{t('sar')} {debt.remainingAmount.toLocaleString()}</h3>
                  {debt.remainingAmount !== debt.amount && (
                    <p className="text-white/40 text-xs font-medium mb-4">
                      {t('original_amount_label')}: {t('sar')} {debt.amount.toLocaleString()}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-[14px] p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{t('to_merchant')}</p>
                      <p className="font-bold text-sm truncate">{debt.merchantName ?? debt.merchantId}</p>
                    </div>
                    <div className="rounded-[14px] p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{t('min_payment')}</p>
                      <p className="font-bold text-sm">{t('sar')} {minPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Payment Mode ── */}
              <div>
                <h3 className="text-xs font-bold text-foreground mb-2.5 uppercase tracking-wider">{t('payment_mode')}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['full', 'half', 'custom'] as PayMode[]).map((mode) => (
                    <button key={mode} onClick={() => setPayMode(mode)}
                      className={`py-3 rounded-[14px] text-xs font-bold border transition-all ${
                        payMode === mode
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-card text-foreground border-border/60 hover:border-foreground/30'
                      }`}>
                      {mode === 'full' ? t('pay_full') : mode === 'half' ? t('pay_half') : t('pay_custom')}
                    </button>
                  ))}
                </div>

                {payMode === 'custom' && (
                  <div className="mt-3">
                    <div className="relative">
                      <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">
                        {t('sar')}
                      </span>
                      <Input
                        type="number" min={1} max={debt.remainingAmount}
                        value={customAmt}
                        onChange={(e) => setCustomAmt(e.target.value)}
                        placeholder={t('enter_amount')}
                        className="ps-12 h-12 rounded-[14px] bg-card border-border/60 text-sm font-bold"
                      />
                    </div>
                    {amtError && (
                      <p className="text-xs font-bold text-destructive mt-1.5 ps-1">{amtError}</p>
                    )}
                  </div>
                )}

                {payMode !== 'custom' && (
                  <p className="text-xs text-muted-foreground font-medium mt-2.5 ps-1">
                    {t('payment_amount')}: <span className="font-bold text-foreground">{t('sar')} {payAmount.toLocaleString()}</span>
                  </p>
                )}
              </div>

              {/* ── Payment Method ── */}
              <div>
                <h3 className="text-xs font-bold text-foreground mb-2.5 uppercase tracking-wider">{t('payment_method')}</h3>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((m) => (
                    <div key={m.value} onClick={() => setMethod(m.value)}
                      className={`flex items-center gap-4 p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                        method === m.value
                          ? 'border-teal bg-teal/5'
                          : 'border-transparent bg-card hover:border-teal/30 shadow-sm'
                      }`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{ background: `${m.dot}1A` }}>
                        <div className="w-4 h-4 rounded-full" style={{ background: m.dot }} />
                      </div>
                      <span className="text-sm font-bold text-foreground flex-1">{m.label}</span>
                      {/* TODO: add payment gateway SDK button/logo here per method */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        method === m.value ? 'border-teal' : 'border-border'
                      }`} style={method === m.value ? { background: '#20D6C7' } : {}}>
                        {method === m.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Payment History ── */}
              {payments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-foreground mb-2.5 uppercase tracking-wider">{t('payment_history_section')}</h3>
                  <div className="bg-card border border-border/60 rounded-[20px] overflow-hidden">
                    {payments.map((p, i) => (
                      <div key={p.id}
                        className={`flex items-center gap-3 px-4 py-3 ${i < payments.length - 1 ? 'border-b border-border/50' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Receipt size={14} className="text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{t('sar')} {p.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground font-medium capitalize mt-0.5">
                            {p.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {format(p.createdAt.toDate(), 'dd MMM yyyy')}
                          </p>
                          <p className="text-[10px] font-bold text-success mt-0.5 capitalize">{p.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Confirm Button ── */}
              <Button
                className="w-full h-14 rounded-[18px] font-bold gap-2 text-base"
                disabled={!isValid}
                onClick={handlePay}>
                <DollarSign size={18} />
                {t('confirm_payment_btn')} · {t('sar')} {isValid ? payAmount.toLocaleString() : '—'}
              </Button>
            </motion.div>
          )}

          {/* ── Status screens ── */}
          {['paid', 'already_paid', 'error'].includes(state) && (
            <motion.div key="status"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border/60 rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm">
              <div className={`rounded-full flex items-center justify-center mb-5 ${
                state === 'paid' || state === 'already_paid'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`} style={{ width: 72, height: 72 }}>
                {(state === 'paid' || state === 'already_paid') && <CheckCircle2 size={36} />}
                {state === 'error'                              && <AlertCircle  size={36} />}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                {state === 'paid'         ? t('payment_success')  :
                 state === 'already_paid' ? t('already_settled')  : t('cannot_process')}
              </h2>
              {state === 'paid' && debt && (
                <div className="bg-secondary/60 rounded-[16px] px-5 py-4 mb-4 w-full">
                  <p className="text-xs text-muted-foreground font-medium">{t('payment_recorded_msg')}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{t('sar')} {payAmount.toLocaleString()}</p>
                  {debt.referenceNumber && (
                    <p className="text-xs font-mono text-muted-foreground mt-1 tracking-wider">{debt.referenceNumber}</p>
                  )}
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'paid'         ? t('payment_success_desc') :
                 state === 'already_paid' ? t('already_paid_desc')    : errorMsg}
              </p>
              <Button variant="outline" className="w-full mt-6 rounded-2xl h-12 font-bold border-border/60"
                onClick={() => window.close()}>
                {t('close_window')}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t('secured_by')} <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" /> PCI DSS
        </div>
      </div>
    </div>
  );
}
