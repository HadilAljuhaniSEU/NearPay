import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByPaymentToken } from '../../services/debtService';
import { recordPayment } from '../../services/paymentService';
import { DebtDoc, PaymentMethod } from '../../types';
import { useT } from '../../contexts/LanguageContext';

type PageState = 'loading' | 'ready' | 'paying' | 'paid' | 'already_paid' | 'error';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; color: string }[] = [
  { value: 'stcpay',        label: 'STC Pay',             color: '#4F008C' },
  { value: 'card',          label: 'Mada / Credit Card',  color: '#16A34A' },
  { value: 'bank_transfer', label: 'Bank Transfer',       color: '#3B82F6' },
];

export default function DebtPaymentPage() {
  const params = useParams<{ token: string }>();
  const token  = params.token;
  const t      = useT();

  const [debt,     setDebt]     = useState<DebtDoc | null>(null);
  const [state,    setState]    = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [method,   setMethod]   = useState<PaymentMethod>('stcpay');

  useEffect(() => {
    if (!token) { setState('error'); setErrorMsg(t('invalid_link')); return; }
    fetchDebtByPaymentToken(token)
      .then((d) => {
        if (!d) { setState('error'); setErrorMsg(t('link_expired')); return; }
        if (d.status === 'settled') { setDebt(d); setState('already_paid'); return; }
        if (d.approvalStatus === 'pending') { setState('error'); setErrorMsg(t('not_approved_yet')); return; }
        if (d.approvalStatus === 'rejected') { setState('error'); setErrorMsg(t('debt_rejected')); return; }
        setDebt(d);
        setState('ready');
      })
      .catch(() => { setState('error'); setErrorMsg(t('load_failed')); });
  }, [token]);

  const handlePay = async () => {
    if (!debt) return;
    setState('paying');
    try {
      await recordPayment({
        debtId: debt.id, merchantId: debt.merchantId, customerId: debt.customerId,
        amount: debt.remainingAmount, currentRemaining: debt.remainingAmount,
        currentCustomerPaid: 0, paymentMethod: method,
      });
      setState('paid');
    } catch {
      setState('error');
      setErrorMsg(t('payment_failed'));
    }
  };

  return (
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      <div className="h-11 w-full px-5 flex items-center justify-between z-50 text-foreground pointer-events-none">
        <span className="text-[14px] font-bold tracking-tight">9:41</span>
        <div className="flex gap-1.5 opacity-50">
          <div className="w-3.5 h-3.5 rounded-full bg-current" />
          <div className="w-3.5 h-3.5 rounded-full bg-current" />
          <div className="w-5 h-3.5 rounded-sm bg-current" />
        </div>
      </div>

      <div className="absolute top-0 end-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.06), transparent)' }} />

      <div className="flex-1 flex flex-col px-5 py-5 pb-12 justify-center relative z-10">
        <div className="mb-7 flex justify-center">
          <NearPayLogo size={36} />
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {(state === 'loading' || state === 'paying') && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
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

          {/* Ready */}
          {state === 'ready' && debt && (
            <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div className="rounded-[28px] p-7 text-white text-center relative overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 8px 32px rgba(11,35,65,0.25)' }}>
                <div className="absolute top-0 start-0 w-32 h-32 rounded-full blur-2xl -ms-10 -mt-10 pointer-events-none"
                     style={{ background: 'rgba(46,216,195,0.15)' }} />
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">{t('amount_due')}</p>
                <h3 className="text-4xl font-bold tracking-tighter mb-5 relative z-10">
                  {t('sar')} {debt.remainingAmount}
                </h3>
                <div className="rounded-xl p-3 text-left relative z-10"
                     style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">{t('to_merchant')}</p>
                  <p className="font-bold text-base">{debt.merchantId}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground mb-3 ps-1 uppercase tracking-wider">{t('payment_method')}</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <div key={m.value} onClick={() => setMethod(m.value)}
                      className={`flex items-center gap-4 p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                        method === m.value ? 'border-teal bg-teal/5' : 'border-transparent bg-card border-border/60 hover:border-teal/30 shadow-sm'
                      }`}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary flex-shrink-0">
                        <div className="w-5 h-5 rounded-full" style={{ background: m.color }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-foreground">{m.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        method === m.value ? 'border-teal' : 'border-border'
                      }`} style={method === m.value ? { background: '#2ED8C3' } : {}}>
                        {method === m.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-[18px] font-bold gap-2"
                onClick={handlePay}
              >
                <CreditCard size={20} />
                {t('pay_now')} {t('sar')} {debt.remainingAmount}
              </Button>
            </motion.div>
          )}

          {/* Status */}
          {['paid', 'already_paid', 'error'].includes(state) && (
            <motion.div key="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border/60 rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm">
              <div className={`rounded-full flex items-center justify-center mb-5 ${
                state === 'paid' || state === 'already_paid' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`} style={{ width: 72, height: 72 }}>
                {(state === 'paid' || state === 'already_paid') && <CheckCircle2 size={36} />}
                {state === 'error' && <AlertCircle size={36} />}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                {state === 'paid'        ? t('payment_success') :
                 state === 'already_paid'? t('already_settled') : t('cannot_process')}
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'paid'         ? t('payment_success_desc') :
                 state === 'already_paid' ? t('already_paid_desc') : errorMsg}
              </p>
              <Button variant="outline" className="w-full mt-6 rounded-2xl h-12 font-bold border-border/60" onClick={() => window.close()}>
                {t('close_window')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t('secured_by')} <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" /> PCI DSS
        </div>
      </div>
    </div>
  );
}
