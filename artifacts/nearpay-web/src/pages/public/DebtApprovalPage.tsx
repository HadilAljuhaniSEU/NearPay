import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Store, Calendar, FileText } from 'lucide-react';
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
    <div className="app-container flex flex-col bg-background relative overflow-hidden">
      {/* Status bar placeholder */}
      <div className="h-12 w-full px-6 flex items-center justify-between z-50 text-foreground pointer-events-none">
        <span className="text-[15px] font-bold tracking-tight">9:41</span>
        <div className="flex gap-1.5 opacity-60">
          <div className="w-4 h-4 rounded-full bg-current" />
          <div className="w-4 h-4 rounded-full bg-current" />
          <div className="w-6 h-4 rounded-sm bg-current" />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="flex-1 flex flex-col px-6 py-6 pb-12 justify-center relative z-10">
        <div className="mb-10 flex justify-center">
          <NearPayLogo size={40} />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Loading ── */}
          {(state === 'loading' || state === 'approving') && (
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
                  {state === 'approving' ? 'Saving your decision...' : 'Loading tab details...'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Ready to act ── */}
          {state === 'ready' && debt && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Tab Request</h1>
                <p className="text-sm font-medium text-muted-foreground mt-2">
                  A merchant is asking to add a new tab to your account.
                </p>
              </div>

              {/* Debt card */}
              <div className="bg-card rounded-[32px] p-6 shadow-soft border border-border">
                <div className="flex flex-col items-center text-center pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                    <Store size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{debt.merchantId}</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Merchant</p>
                </div>

                <div className="py-6 text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Requested Amount</p>
                  <h3 className="text-5xl font-bold tracking-tighter text-foreground">
                    SAR {debt.amount}
                  </h3>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  {debt.description && (
                    <div className="flex gap-3 text-sm">
                      <FileText size={18} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground">{debt.description}</span>
                    </div>
                  )}
                  {debt.dueDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={18} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">Due: {debt.dueDate.toDate().toLocaleDateString('en-SA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-16 rounded-2xl text-base font-bold border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10"
                  onClick={handleReject}
                >
                  Reject
                </Button>
                <Button
                  className="flex-[2] h-16 rounded-2xl text-base font-bold shadow-lg hover-elevate bg-primary text-primary-foreground"
                  onClick={handleApprove}
                >
                  <CheckCircle2 className="mr-2" size={20} />
                  Approve Tab
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Status States ── */}
          {['already_handled', 'approved', 'rejected', 'error'].includes(state) && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[32px] p-8 flex flex-col items-center text-center shadow-soft"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                state === 'approved' ? 'bg-success/10 text-success' :
                state === 'rejected' || state === 'error' ? 'bg-destructive/10 text-destructive' :
                'bg-secondary text-muted-foreground'
              }`}>
                {state === 'approved' && <CheckCircle2 size={40} />}
                {(state === 'rejected' || state === 'error') && <XCircle size={40} />}
                {state === 'already_handled' && <AlertCircle size={40} />}
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                {state === 'approved' ? 'Tab Approved' :
                 state === 'rejected' ? 'Tab Rejected' :
                 state === 'already_handled' ? 'Already Processed' : 'Invalid Link'}
              </h2>
              
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'approved' ? 'The merchant has been notified. You can safely close this page.' :
                 state === 'rejected' ? 'The merchant has been notified of your rejection.' :
                 state === 'already_handled' && debt ? `This tab was already ${debt.approvalStatus}.` :
                 errorMsg}
              </p>

              <Button variant="outline" className="w-full mt-8 rounded-2xl h-14 font-bold border-border" onClick={() => window.close()}>
                Close Window
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="absolute bottom-6 left-0 right-0 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Secured by NearPay
        </p>
      </div>
    </div>
  );
}