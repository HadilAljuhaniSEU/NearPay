import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertCircle, Loader2,
  Store, Calendar, FileText, Hash, User, MessageSquare,
} from 'lucide-react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByApprovalToken, updateDebtApproval, updateDebtDispute } from '../../services/debtService';
import { fetchMerchant } from '../../services/merchantService';
import { auth } from '../../lib/firebase';
import { DebtDoc } from '../../types';
import { useT } from '../../contexts/LanguageContext';

type PageState =
  | 'auth_check' | 'loading' | 'ready'
  | 'dispute_form' | 'submitting'
  | 'approved' | 'disputed' | 'already_handled' | 'error';

export default function DebtApprovalPage() {
  const params = useParams<{ token: string }>();
  const token  = params.token;
  const t      = useT();
  const [_, setLocation] = useLocation();

  const [debt,          setDebt]          = useState<DebtDoc | null>(null);
  const [merchantName,  setMerchantName]  = useState('');
  const [state,         setState]         = useState<PageState>('auth_check');
  const [errorMsg,      setErrorMsg]      = useState('');
  const [disputeReason, setDisputeReason] = useState('');

  // ── Step 1: verify customer is authenticated ──────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      unsub();
      if (!user) {
        setLocation(`/customer/otp?redirect=${encodeURIComponent(`/debt/approve/${token}`)}`);
      } else {
        setState('loading');
      }
    });
    return unsub;
  }, [token]);

  // ── Step 2: load debt once authenticated ─────────────────────────────────
  useEffect(() => {
    if (state !== 'loading') return;
    if (!token) { setState('error'); setErrorMsg(t('invalid_link')); return; }

    fetchDebtByApprovalToken(token)
      .then(async (d) => {
        if (!d) { setState('error'); setErrorMsg(t('link_expired')); return; }
        if (d.approvalStatus !== 'pending') { setDebt(d); setState('already_handled'); return; }
        setDebt(d);
        // Resolve merchant display name
        try {
          const m = await fetchMerchant(d.merchantId);
          setMerchantName(m?.name ?? m?.businessName ?? d.merchantName ?? d.merchantId);
        } catch {
          setMerchantName(d.merchantName ?? d.merchantId);
        }
        setState('ready');
      })
      .catch(() => { setState('error'); setErrorMsg(t('load_failed')); });
  }, [state, token]);

  const handleApprove = async () => {
    if (!debt) return;
    setState('submitting');
    try {
      await updateDebtApproval(debt.id, 'approved');
      setState('approved');
    } catch {
      setState('error');
      setErrorMsg(t('approve_failed'));
    }
  };

  const handleDispute = async () => {
    if (!debt || !disputeReason.trim()) return;
    setState('submitting');
    try {
      await updateDebtDispute(debt.id, disputeReason.trim());
      setState('disputed');
    } catch {
      setState('error');
      setErrorMsg(t('approve_failed'));
    }
  };

  const isLoading = state === 'auth_check' || state === 'loading' || state === 'submitting';
  const isDone    = ['approved', 'disputed', 'already_handled', 'error'].includes(state);

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

      {/* Ambient glow */}
      <div className="absolute top-0 end-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.08), transparent)' }} />

      <div className="flex-1 flex flex-col px-5 py-4 pb-10 overflow-y-auto relative z-10">
        <div className="mb-6 flex justify-center">
          <NearPayLogo size={32} />
        </div>

        <AnimatePresence mode="wait">

          {/* ── Loading / submitting ── */}
          {isLoading && (
            <motion.div key="loading"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="bg-card border border-border/60 rounded-[28px] p-10 flex flex-col items-center gap-5 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t('processing')}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {state === 'submitting' ? t('saving_decision') : t('loading_tab_details')}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Debt details view ── */}
          {state === 'ready' && debt && (
            <motion.div key="ready"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4">

              <div className="text-center">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{t('tab_request')}</h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">{t('tab_request_desc')}</p>
              </div>

              {/* Debt detail card */}
              <div className="bg-card rounded-[24px] p-5 shadow-sm border border-border/60">
                {/* Merchant */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border/50">
                  <div className="w-12 h-12 bg-primary/8 text-primary rounded-[16px] flex items-center justify-center flex-shrink-0">
                    <Store size={24} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{merchantName}</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{t('merchant_label')}</p>
                  </div>
                </div>

                {/* Reference number */}
                {debt.referenceNumber && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 bg-secondary/60 rounded-[12px]">
                    <Hash size={13} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-bold text-foreground font-mono tracking-wider">{debt.referenceNumber}</span>
                  </div>
                )}

                {/* Customer name */}
                <div className="flex items-center gap-3 py-3 border-b border-border/40">
                  <User size={15} className="text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('customer_label')}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{debt.customerName}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="py-5 text-center border-b border-border/40">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{t('requested_amount')}</p>
                  <h3 className="text-4xl font-bold tracking-tighter text-foreground">{t('sar')} {debt.amount.toLocaleString()}</h3>
                  {debt.remainingAmount !== debt.amount && (
                    <p className="text-sm text-muted-foreground font-medium mt-1.5">
                      {t('remaining_label')}: <span className="font-bold text-foreground">{t('sar')} {debt.remainingAmount.toLocaleString()}</span>
                    </p>
                  )}
                </div>

                {/* Description + due date */}
                <div className="pt-4 space-y-3">
                  {debt.description && (
                    <div className="flex items-start gap-3 text-sm">
                      <FileText size={15} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground">{debt.description}</span>
                    </div>
                  )}
                  {debt.dueDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={15} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground">
                        {t('due')} {debt.dueDate.toDate().toLocaleDateString('en-SA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline"
                  className="flex-1 h-14 rounded-2xl font-bold border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10"
                  onClick={() => setState('dispute_form')}>
                  <MessageSquare size={16} className="me-2" />
                  {t('dispute_btn')}
                </Button>
                <Button className="flex-[2] h-14 rounded-2xl font-bold" onClick={handleApprove}>
                  <CheckCircle2 size={18} className="me-2" />
                  {t('approve_debt_btn')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Dispute form ── */}
          {state === 'dispute_form' && debt && (
            <motion.div key="dispute"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4">
              <div className="text-center">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{t('dispute_title')}</h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">{t('dispute_desc')}</p>
              </div>

              <div className="bg-card rounded-[24px] p-5 shadow-sm border border-border/60">
                {debt.referenceNumber && (
                  <div className="flex items-center gap-2 mb-4 p-2.5 bg-secondary/60 rounded-[12px]">
                    <Hash size={13} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-bold text-foreground font-mono">{debt.referenceNumber}</span>
                  </div>
                )}
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                  {t('dispute_reason_label')}
                </label>
                <Textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder={t('dispute_reason_placeholder')}
                  className="min-h-[130px] resize-none rounded-[14px] bg-secondary border-0 text-sm font-medium"
                />
              </div>

              <Button className="w-full h-14 rounded-2xl font-bold"
                disabled={!disputeReason.trim()}
                onClick={handleDispute}>
                {t('submit_dispute')}
              </Button>
              <Button variant="ghost" className="w-full h-11 rounded-2xl font-bold"
                onClick={() => setState('ready')}>
                {t('go_back')}
              </Button>
            </motion.div>
          )}

          {/* ── Status / done screens ── */}
          {isDone && (
            <motion.div key="status"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border/60 rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm">
              <div className={`rounded-full flex items-center justify-center mb-5 ${
                state === 'approved' ? 'bg-success/10 text-success' :
                state === 'disputed' || state === 'error' ? 'bg-destructive/10 text-destructive' :
                'bg-secondary text-muted-foreground'
              }`} style={{ width: 72, height: 72 }}>
                {state === 'approved'                              && <CheckCircle2 size={36} />}
                {(state === 'disputed' || state === 'error')      && <XCircle      size={36} />}
                {state === 'already_handled'                      && <AlertCircle  size={36} />}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                {state === 'approved'        ? t('tab_approved')      :
                 state === 'disputed'        ? t('disputed_title')    :
                 state === 'already_handled' ? t('already_processed') : t('invalid_link')}
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'approved'        ? t('approved_desc') :
                 state === 'disputed'        ? t('disputed_desc') :
                 state === 'already_handled' && debt ? `${t('already_status')} ${debt.approvalStatus}.` :
                 errorMsg}
              </p>
              <Button variant="outline" className="w-full mt-6 rounded-2xl h-12 font-bold border-border/60"
                onClick={() => window.close()}>
                {t('close_window')}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="mt-6 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t('secured_by')}
        </p>
      </div>
    </div>
  );
}
