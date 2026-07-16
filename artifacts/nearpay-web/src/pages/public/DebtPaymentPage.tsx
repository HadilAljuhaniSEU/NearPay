import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByPaymentToken } from '../../services/debtService';
import { recordPayment } from '../../services/paymentService';
import { DebtDoc, PaymentMethod } from '../../types';

type PageState = 'loading' | 'ready' | 'paying' | 'paid' | 'already_paid' | 'error';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'stcpay', label: 'STC Pay', icon: '💳' },
  { value: 'card', label: 'Credit / Debit Card', icon: '🏦' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏛️' },
  { value: 'cash', label: 'Cash', icon: '💵' },
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
    <div className="app-container flex flex-col bg-card">
      <div className="h-11 bg-card flex items-center px-6">
        <span className="text-xs font-semibold text-foreground">9:41</span>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
          <NearPayLogo className="mb-2 justify-center" />

          {/* ── Loading ── */}
          {(state === 'loading' || state === 'paying') && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                {state === 'paying' ? 'Processing payment…' : 'Loading…'}
              </p>
            </div>
          )}

          {/* ── Ready ── */}
          {state === 'ready' && debt && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Pay Debt</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a payment method
                </p>
              </div>

              {/* Amount */}
              <div className="bg-primary rounded-2xl p-5 text-center">
                <p className="text-primary-foreground/70 text-sm mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-primary-foreground">
                  {debt.remainingAmount.toLocaleString('ar-SA', {
                    style: 'currency',
                    currency: 'SAR',
                  })}
                </p>
                {debt.description && (
                  <p className="text-primary-foreground/70 text-xs mt-2">{debt.description}</p>
                )}
              </div>

              {/* Payment method selector */}
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      method === m.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-secondary/40'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-xs font-semibold text-foreground leading-tight text-center">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              <Button
                className="w-full h-14 rounded-2xl text-base font-semibold"
                onClick={handlePay}
              >
                <CreditCard className="mr-2" size={20} />
                Pay Now
              </Button>
            </motion.div>
          )}

          {/* ── Paid ── */}
          {state === 'paid' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Payment Successful</h2>
              <p className="text-sm text-muted-foreground">
                The merchant has been notified. You can close this page.
              </p>
            </motion.div>
          )}

          {/* ── Already paid ── */}
          {state === 'already_paid' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Already Settled</h2>
              <p className="text-sm text-muted-foreground">
                This debt has already been paid in full.
              </p>
            </motion.div>
          )}

          {/* ── Error ── */}
          {state === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-9 h-9 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Cannot Process</h2>
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground pb-2">
          Secured by NearPay · No account required
        </p>
      </div>
    </div>
  );
}
