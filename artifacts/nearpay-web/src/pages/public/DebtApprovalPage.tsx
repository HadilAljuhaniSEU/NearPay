import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Store, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NearPayLogo } from '../../components/NearPayLogo';
import { fetchDebtByApprovalToken, updateDebtApproval } from '../../services/debtService';
import { DebtDoc } from '../../types';
import { useT } from '../../contexts/LanguageContext';

type PageState = 'loading' | 'ready' | 'approving' | 'approved' | 'rejected' | 'already_handled' | 'error';

export default function DebtApprovalPage() {
  const params = useParams<{ token: string }>();
  const token  = params.token;
  const t      = useT();

  const [debt,     setDebt]     = useState<DebtDoc | null>(null);
  const [state,    setState]    = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('error'); setErrorMsg(t('invalid_link')); return; }
    fetchDebtByApprovalToken(token)
      .then((d) => {
        if (!d) { setState('error'); setErrorMsg(t('link_expired')); return; }
        if (d.approvalStatus !== 'pending') { setDebt(d); setState('already_handled'); return; }
        setDebt(d);
        setState('ready');
      })
      .catch(() => { setState('error'); setErrorMsg(t('load_failed')); });
  }, [token]);

  const handleApprove = async () => {
    if (!debt) return;
    setState('approving');
    try { await updateDebtApproval(debt.id, 'approved'); setState('approved'); }
    catch { setState('error'); setErrorMsg(t('approve_failed')); }
  };

  const handleReject = async () => {
    if (!debt) return;
    setState('approving');
    try { await updateDebtApproval(debt.id, 'rejected'); setState('rejected'); }
    catch { setState('error'); setErrorMsg(t('reject_failed')); }
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

      <div className="absolute top-0 end-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(46,216,195,0.08), transparent)' }} />

      <div className="flex-1 flex flex-col px-5 py-6 pb-12 justify-center relative z-10">
        <div className="mb-8 flex justify-center">
          <NearPayLogo size={36} />
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {(state === 'loading' || state === 'approving') && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="bg-card border border-border/60 rounded-[28px] p-10 flex flex-col items-center gap-5 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t('processing')}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {state === 'approving' ? t('saving_decision') : t('loading_tab_details')}
                </p>
              </div>
            </motion.div>
          )}

          {/* Ready */}
          {state === 'ready' && debt && (
            <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('tab_request')}</h1>
                <p className="text-sm font-medium text-muted-foreground mt-1.5">{t('tab_request_desc')}</p>
              </div>

              <div className="bg-card rounded-[28px] p-6 shadow-sm border border-border/60">
                <div className="flex flex-col items-center text-center pb-5 border-b border-border/50">
                  <div className="w-14 h-14 bg-primary/8 text-primary rounded-[18px] flex items-center justify-center mb-3">
                    <Store size={28} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{debt.merchantId}</h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{t('merchant_label')}</p>
                </div>
                <div className="py-5 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('requested_amount')}</p>
                  <h3 className="text-4xl font-bold tracking-tighter text-foreground">{t('sar')} {debt.amount}</h3>
                </div>
                <div className="space-y-3 pt-4 border-t border-border/50">
                  {debt.description && (
                    <div className="flex gap-3 text-sm">
                      <FileText size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground">{debt.description}</span>
                    </div>
                  )}
                  {debt.dueDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {t('due')} {debt.dueDate.toDate().toLocaleDateString('en-SA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10" onClick={handleReject}>
                  {t('reject_btn')}
                </Button>
                <Button className="flex-[2] h-14 rounded-2xl font-bold" onClick={handleApprove}>
                  <CheckCircle2 className="me-2" size={18} />
                  {t('approve_btn')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Status */}
          {['already_handled', 'approved', 'rejected', 'error'].includes(state) && (
            <motion.div key="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border/60 rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm">
              <div className={`w-18 h-18 rounded-full flex items-center justify-center mb-5 ${
                state === 'approved'  ? 'bg-success/10 text-success' :
                state === 'rejected' || state === 'error' ? 'bg-destructive/10 text-destructive' :
                'bg-secondary text-muted-foreground'
              }`} style={{ width: 72, height: 72 }}>
                {state === 'approved'       && <CheckCircle2 size={36} />}
                {(state === 'rejected' || state === 'error') && <XCircle size={36} />}
                {state === 'already_handled' && <AlertCircle size={36} />}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                {state === 'approved'        ? t('tab_approved')       :
                 state === 'rejected'        ? t('tab_rejected')       :
                 state === 'already_handled' ? t('already_processed')  : t('invalid_link')}
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {state === 'approved'        ? t('approved_desc') :
                 state === 'rejected'        ? t('rejected_desc') :
                 state === 'already_handled' && debt ? `${t('already_status')} ${debt.approvalStatus}.` :
                 errorMsg}
              </p>
              <Button variant="outline" className="w-full mt-6 rounded-2xl h-12 font-bold border-border/60" onClick={() => window.close()}>
                {t('close_window')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="absolute bottom-5 left-0 right-0 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t('secured_by')}
        </p>
      </div>
    </div>
  );
}
