import React from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Calendar, AlertCircle, Share2, CreditCard } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { mockDebts, mockCustomers } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useT } from '../../contexts/LanguageContext';

export default function DebtDetailPage() {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const t = useT();
  const id = params.id;

  const debt = mockDebts.find(d => d.id === id) || mockDebts[0];
  const customer = mockCustomers.find(c => c.id === debt.customerId) || mockCustomers[0];

  const isOverdue = debt.status === 'overdue';
  const isSettled = debt.status === 'settled';

  const formattedDate    = debt.date    ? format(new Date(debt.date), 'MMM dd, yyyy')    : '';
  const formattedDueDate = debt.dueDate ? format(new Date(debt.dueDate), 'MMM dd, yyyy') : '';

  const statusColors: Record<string, string> = {
    pending:  'bg-warning/10 text-warning border-warning/20',
    active:   'bg-teal/10 text-teal border-teal/20',
    overdue:  'bg-destructive/10 text-destructive border-destructive/20',
    settled:  'bg-secondary text-muted-foreground border-border',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statusLabelKeys: Record<string, Parameters<typeof t>[0]> = {
    pending:  'status_pending',
    active:   'status_active',
    overdue:  'status_overdue',
    settled:  'status_settled',
    rejected: 'status_rejected',
  };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />

      <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/merchant/debts')} className="rounded-full -ms-2 hover:bg-secondary text-foreground">
            <ArrowLeft size={22} className="rtl-flip" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('tab_details_title')}</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-secondary/50 text-foreground">
          <Share2 size={17} />
        </Button>
      </div>

      <div className="page-scroll">
        {/* Header Amount Card */}
        <div className="px-5 py-6 pb-8 bg-card border-b border-border/40 rounded-b-[28px] relative z-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md mb-4">
              <AvatarFallback className="bg-primary/8 text-primary text-2xl font-bold">
                {customer.avatar}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground mb-1">{customer.name}</h2>
            <p className="text-xs font-medium text-muted-foreground mb-6 flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
              <Phone size={12} /> {customer.phone}
            </p>

            <div className={`rounded-[28px] p-6 w-full relative overflow-hidden border ${
              isOverdue  ? 'bg-destructive/5 border-destructive/20' :
              isSettled  ? 'bg-secondary/50 border-border' :
                           'border-teal/20'
            }`} style={!isOverdue && !isSettled ? { background: 'rgba(46,216,195,0.06)' } : {}}>
              <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                {isSettled ? t('settled_amount') : t('amount_due')}
              </p>
              <h3 className={`text-5xl font-bold tracking-tighter mb-4 ${
                isOverdue ? 'text-destructive' : isSettled ? 'text-foreground' : 'text-foreground'
              }`}>
                {debt.amount}
              </h3>

              <div className="flex justify-center gap-2">
                <Badge variant="outline" className={`rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] border ${statusColors[debt.status] || ''}`}>
                  {t(statusLabelKeys[debt.status] ?? 'status_pending')}
                </Badge>
                <Badge variant="outline" className="rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] bg-background border-border">
                  {debt.category}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex w-full gap-3 mt-5">
              <Button variant="outline" className="flex-1 rounded-2xl h-13 gap-2 border-border/60 font-bold bg-background hover:bg-secondary text-foreground text-sm">
                <MessageCircle size={18} style={{ color: '#25D366' }} /> {t('whatsapp')}
              </Button>
              <Button variant="outline" className="flex-1 rounded-2xl h-13 gap-2 border-border/60 font-bold bg-background hover:bg-secondary text-foreground text-sm">
                <Phone size={18} className="text-teal" /> {t('call')}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Details */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('tab_info')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <Calendar size={15} />
                  </div>
                  <span className="font-semibold text-sm">{t('created_date')}</span>
                </div>
                <span className="font-bold text-foreground text-sm">{formattedDate}</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-secondary'}`}>
                    <AlertCircle size={15} />
                  </div>
                  <span className="font-semibold text-sm">{t('due_date')}</span>
                </div>
                <span className={`font-bold text-sm ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>{formattedDueDate}</span>
              </div>

              {debt.notes && (
                <>
                  <div className="h-px bg-border/60" />
                  <div className="flex justify-between items-start pt-1">
                    <span className="font-semibold text-sm text-muted-foreground min-w-20 pt-0.5">{t('tab_notes')}</span>
                    <span className="font-medium text-sm text-foreground text-end leading-relaxed">{debt.notes}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">{t('activity_history')}</h3>
            <div className="bg-card rounded-[22px] border border-border/60 p-5 shadow-sm">
              <div className="space-y-5 relative before:absolute before:inset-0 before:ms-[15px] before:w-0.5 before:bg-border/50">
                {isOverdue && (
                  <div className="relative ps-9">
                    <div className="absolute start-[11px] top-1 w-2.5 h-2.5 rounded-full bg-destructive ring-4 ring-card" />
                    <p className="font-bold text-sm text-destructive mb-0.5">{t('marked_overdue')}</p>
                    <p className="text-xs text-muted-foreground font-medium">{formattedDueDate} · {t('automated_update')}</p>
                  </div>
                )}
                <div className="relative ps-9">
                  <div className="absolute start-[11px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-card"
                       style={{ background: '#2ED8C3' }} />
                  <p className="font-bold text-sm text-foreground mb-0.5">{t('tab_created')}</p>
                  <p className="text-xs text-muted-foreground font-medium">{formattedDate} · {t('initial_entry')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-24" />
        </div>
      </div>

      {!isSettled && (
        <div className="absolute bottom-0 w-full p-5 bg-background/90 backdrop-blur-xl border-t border-border/30 z-50">
          <Button className="w-full h-14 rounded-[18px] text-base font-bold gap-2">
            <CreditCard size={19} />
            {t('record_payment')}
          </Button>
        </div>
      )}
    </div>
  );
}
