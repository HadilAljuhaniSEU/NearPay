import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByPaymentToken } from '../../services/debtService';
import { recordPayment } from '../../services/paymentService';
import { DebtDoc, PaymentMethod } from '../../types';

type PageState = 'loading' | 'ready' | 'paying' | 'paid' | 'already_paid' | 'error';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string, color: string }[] = [
  { value: 'stcpay', label: 'STC Pay', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z', color: '#4F008C' },
  { value: 'card', label: 'Mada / Credit Card', icon: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z', color: '#16A34A' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: 'M12 3L1 9h4v8H3v2h18v-2h-2V9h4L12 3zm6 14H6V9h12v8z', color: '#3B82F6' },
];

export default function DebtPaymentPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [debt, setDebt] = useState<DebtDoc | null>(null);
  const [state, setState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('stcpay');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMsg('Invalid link.');
      return;
    }

    fetchDebtByPaymentToken(token)
      .then((d) => {
        if (!d) {
          setState('error');
          setErrorMsg('This payment link is invalid or has expired.');
          return;
        }
        if (d.status === 'settled') {
          setDebt(d);
          setState('already_paid');
          return;
        }
        if (d.approvalStatus === 'pending') {
          setState('error');
          setErrorMsg('This debt has not been approved yet. Please approve it first.');
          return;
        }
        if (d.approvalStatus === 'rejected') {
          setState('error');
          setErrorMsg('This debt was rejected and cannot be paid.');
          return;
        }
        setDebt(d);
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setErrorMsg('Could not load payment details. Please try again.');
      });
  }, [token]);

  const handlePay = async () => {
    if (!debt) return;
    setState('paying');
    try {
      await recordPayment({
        debtId: debt.id,
        merchantId: debt.merchantId,
        customerId: debt.customerId,
        amount: debt.remainingAmount,
        currentRemaining: debt.remainingAmount,
        currentCustomerPaid: 0,
        paymentMethod: method,
      });
      setState('paid');
    } catch {
      setState('error');
      setErrorMsg('Payment failed. Please try again.');
    }
  };

  return (
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      <div className="h-12 w-full px-6 flex items-center justify-between z-50 text-foreground pointer-events-none">
        <span className="text-[15px] font-bold tracking-tight">9:41</span>
        <div className="flex gap-1.5 opacity-60">
          <div className="w-4 h-4 rounded-full bg-current" />
          <div className="w-4 h-4 rounded-full bg-current" />
          <div className="w-6 h-4 rounded-sm bg-current" />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex-1 flex flex-col px-6 py-6 pb-12 justify-center relative z-10">
        <div className="mb-8 flex justify-center">
          <NearPayLogo size={40} />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Loading ── */}
          {(state === 'loading' || state === 'paying') && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-[32px] p-10 flex flex-col items-center gap-5 shadow-soft text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Processing</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {state === 'paying' ? 'Securely processing payment...' : 'Loading details...'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Ready ── */}
          {state === 'ready' && debt && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-foreground text-background rounded-[32px] p-8 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -ml-10 -mt-10" />
                
                <p className="text-background/70 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Amount Due</p>
                <h3 className="text-5xl font-black tracking-tighter mb-6 relative z-10">
                  SAR {debt.remainingAmount}
                </h3>
                
                <div className="bg-background/10 rounded-2xl p-4 backdrop-blur-sm relative z-10 text-left">
                  <p className="text-xs font-bold text-background/60 uppercase tracking-widest mb-1">To Merchant</p>
                  <p className="font-bold text-lg">{debt.merchantId}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 px-2">Payment Method</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.value}
                      onClick={() => setMethod(m.value)}
                      className={`flex items-center gap-4 p-4 rounded-[20px] border-2 cursor-pointer transition-all ${
                        method === m.value
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent bg-card border-border hover:border-primary/20 shadow-sm'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill={m.color}>
                          <path d={m.icon} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-foreground">{m.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === m.value ? 'border-primary bg-primary' : 'border-border'}`}>
                        {method === m.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-16 rounded-[20px] text-lg font-bold shadow-lg hover-elevate mt-2 bg-primary text-primary-foreground"
                onClick={handlePay}
              >
                <CreditCard className="mr-2" size={24} />
                Pay SAR {debt.remainingAmount}
              </Button>
            </motion.div>
          )}

          {/* ── Status States ── */}
          {['paid', 'already_paid', 'error'].includes(state) && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[32px] p-8 flex flex-col items-center text-center shadow-soft"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                state === 'paid' || state === 'already_paid' ? 'bg-success/10 text-success' :
                'bg-destructive/10 text-destructive'
              }`}>
                {(state === 'paid' || state === 'already_paid') && <CheckCircle2 size={40} />}
                {state === 'error' && <AlertCircle size={40} />}
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                {state === 'paid' ? 'Payment Successful' :
                 state === 'already_paid' ? 'Already Settled' :
                 'Cannot Process'}
              </h2>
              
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'paid' ? 'Your payment has been securely processed and the merchant is notified.' :
                 state === 'already_paid' ? 'This debt has already been paid in full.' :
                 errorMsg}
              </p>

              <Button variant="outline" className="w-full mt-8 rounded-2xl h-14 font-bold border-border" onClick={() => window.close()}>
                Close Window
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Secured by NearPay <span className="w-1 h-1 rounded-full bg-muted-foreground" /> PCI DSS
        </div>
      </div>
    </div>
  );
}