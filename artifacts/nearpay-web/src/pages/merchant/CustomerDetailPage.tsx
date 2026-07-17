import React, { useMemo } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import {
  Phone, Mail, CreditCard, Clock, CheckCircle2, AlertTriangle,
  FileText, Wallet, Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBar } from '../../components/StatusBar';
import { PageHeader } from '../../components/PageHeader';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCustomer } from '../../hooks/useCustomers';
import { useDebts } from '../../hooks/useDebts';
import { useMerchantPayments } from '../../hooks/usePayments';
import { useT } from '../../contexts/LanguageContext';
import { BottomNav } from '../../components/BottomNav';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pending:  { icon: Clock,         color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  active:   { icon: CreditCard,    color: '#20D6C7', bg: 'rgba(32,214,199,0.1)'  },
  overdue:  { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)'   },
  settled:  { icon: CheckCircle2,  color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
  rejected: { icon: AlertTriangle, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = params.id ?? '';
  const { merchant } = useAuthContext();
  const t = useT();

  const { customer, loading: customerLoading } = useCustomer(customerId || null);
  const { debts, loading: debtsLoading }        = useDebts(merchant?.id ?? null);
  const { payments, loading: paymentsLoading }  = useMerchantPayments(merchant?.id ?? null);

  const customerDebts    = useMemo(() => debts.filter(d => d.customerId === customerId), [debts, customerId]);
  const activeDebts      = useMemo(() => customerDebts.filter(d => d.status !== 'settled' && d.status !== 'rejected'), [customerDebts]);
  const customerPayments = useMemo(() =>
    payments.filter(p => p.customerId === customerId).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()),
    [payments, customerId]);

  const isLoading = customerLoading || debtsLoading || paymentsLoading;
  const cardCls   = 'bg-card border border-border/60 rounded-[22px] shadow-sm overflow-hidden';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader
        title={customer?.fullName || t('customer_details_title')}
        subtitle={customer?.phone}
        showBack
        showSettings
      />

      <div className="page-scroll px-5 py-4 space-y-4 pb-32">
        {isLoading ? (
          [1, 2, 3].map(i => <SkeletonCard key={i} />)
        ) : !customer ? (
          <div className="text-center py-20 flex flex-col items-center">
            <Users size={40} className="text-muted-foreground/40 mb-3" />
            <p className="text-base font-bold text-muted-foreground">{t('no_customers_yet')}</p>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/60 rounded-[24px] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border/40">
                  <AvatarFallback className="bg-primary/8 text-primary font-bold text-xl">
                    {getInitials(customer.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-foreground">{customer.fullName}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Phone size={13} />
                    <span className="font-medium" dir="ltr">{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                      <Mail size={13} />
                      <span className="font-medium truncate">{customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border/40">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{t('sar')} {customer.totalDebt.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{t('owes')}</p>
                </div>
                <div className="text-center border-x border-border/40">
                  <p className="text-lg font-bold text-foreground">{t('sar')} {customer.totalPaid.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{t('collected')}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{customer.trustScore}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{t('score_label').replace(':', '')}</p>
                </div>
              </div>
            </motion.div>

            {/* Active Debts */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className={cardCls}>
              <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={13} className="text-teal" />
                  {t('customer_active_debts')}
                </h3>
                <span className="text-xs font-bold text-muted-foreground">
                  {activeDebts.length}
                </span>
              </div>
              {activeDebts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground font-medium">{t('no_active_debts')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {activeDebts.map(debt => {
                    const cfg = STATUS_CONFIG[debt.status] ?? STATUS_CONFIG.active;
                    const Icon = cfg.icon;
                    return (
                      <div key={debt.id} className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                               style={{ background: cfg.bg }}>
                            <Icon size={14} style={{ color: cfg.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground capitalize">{debt.status}</p>
                            {debt.dueDate && (
                              <p className="text-[11px] text-muted-foreground font-medium">
                                {t('due')} {format(debt.dueDate.toDate(), 'MMM d, yyyy')}
                              </p>
                            )}
                            {debt.description && (
                              <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[160px]">
                                {debt.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-end">
                          <p className="text-sm font-bold text-foreground">{t('sar')} {debt.remainingAmount.toLocaleString()}</p>
                          {debt.remainingAmount !== debt.amount && (
                            <p className="text-[10px] text-muted-foreground">of {t('sar')} {debt.amount.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Payment History */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className={cardCls}>
              <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-success" />
                  {t('payment_history_section')}
                </h3>
                <span className="text-xs font-bold text-muted-foreground">{customerPayments.length}</span>
              </div>
              {customerPayments.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground font-medium">{t('no_payments_yet')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {customerPayments.slice(0, 10).map(pmt => (
                    <div key={pmt.id} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {t('sar')} {pmt.amount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          {pmt.createdAt ? format(pmt.createdAt.toDate(), 'MMM d, yyyy') : '—'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                        {pmt.paymentMethod || 'Cash'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Notes */}
            {customerDebts.some(d => d.description) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
                className={cardCls}>
                <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText size={13} className="text-muted-foreground" />
                    {t('customer_notes_display')}
                  </h3>
                </div>
                <div className="p-5 space-y-2">
                  {customerDebts.filter(d => d.description).map(d => (
                    <div key={d.id} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground font-medium">{d.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
