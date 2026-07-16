import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByApprovalToken, updateDebtApproval } from '../../services/debtService';
import { DebtDoc } from '../../types';

type PageState = 'loading' | 'ready' | 'approving' | 'approved' | 'rejected' | 'already_handled' | 'error';

export default function DebtApprovalPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [debt, setDebt] = useState<DebtDoc | null>(null);
  const [state, setState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMsg('Invalid link.');
      return;
    }

    fetchDebtByApprovalToken(token)
      .then((d) => {
        if (!d) {
          setState('error');
          setErrorMsg('This link is invalid or has expired.');
          return;
        }
        if (d.approvalStatus !== 'pending') {
          setDebt(d);
          setState('already_handled');
          return;
        }
        setDebt(d);
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setErrorMsg('Could not load debt details. Please try again.');
      });
  }, [token]);

  const handleApprove = async () => {
    if (!debt) return;
    setState('approving');
    try {
      await updateDebtApproval(debt.id, 'approved');
      setState('approved');
    } catch {
      setState('error');
      setErrorMsg('Failed to approve. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!debt) return;
    setState('approving');
    try {
      await updateDebtApproval(debt.id, 'rejected');
      setState('rejected');
    } catch {
      setState('error');
      setErrorMsg('Failed to reject. Please try again.');
    }
  };

  return (
    <div className="app-container flex flex-col bg-card">
      {/* Status bar placeholder */}
      <div className="h-11 bg-card flex items-center px-6">
        <span className="text-xs font-semibold text-foreground">9:41</span>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 justify-between relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
          <NearPayLogo className="mb-2 justify-center" />

          {/* ── Loading ── */}
          {state === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading debt details…</p>
            </div>
          )}

          {/* ── Approving ── */}
          {state === 'approving' && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Processing…</p>
            </div>
          )}

          {/* ── Ready to act ── */}
          {state === 'ready' && debt && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Debt Approval</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Please review and respond below
                </p>
              </div>

              {/* Debt card */}
              <div className="bg-secondary/60 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Merchant</span>
                  <span className="text-sm font-semibold text-foreground">{debt.merchantId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold text-foreground">
                    {debt.amount.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                  </span>
                </div>
                {debt.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Note</span>
                    <span className="text-sm text-foreground max-w-[60%] text-right">{debt.description}</span>
                  </div>
                )}
                {debt.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due</span>
                    <span className="text-sm font-medium text-foreground">
                      {debt.dueDate.toDate().toLocaleDateString('en-SA')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-14 rounded-2xl text-base font-semibold"
                  onClick={handleApprove}
                >
                  <CheckCircle className="mr-2" size={20} />
                  Approve Debt
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-base font-semibold border-destructive text-destructive hover:bg-destructive/5"
                  onClick={handleReject}
                >
                  <XCircle className="mr-2" size={20} />
                  Reject Debt
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Already handled ── */}
          {state === 'already_handled' && debt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <AlertCircle className="w-14 h-14 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground">Already Responded</h2>
              <p className="text-sm text-muted-foreground">
                This debt was already{' '}
                <span className={debt.approvalStatus === 'approved' ? 'text-primary font-semibold' : 'text-destructive font-semibold'}>
                  {debt.approvalStatus}
                </span>
                .
              </p>
            </motion.div>
          )}

          {/* ── Approved ── */}
          {state === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Debt Approved</h2>
              <p className="text-sm text-muted-foreground">
                The merchant has been notified. You can close this page.
              </p>
            </motion.div>
          )}

          {/* ── Rejected ── */}
          {state === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-9 h-9 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Debt Rejected</h2>
              <p className="text-sm text-muted-foreground">
                The merchant has been notified. You can close this page.
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
              <h2 className="text-xl font-bold text-foreground">Invalid Link</h2>
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
