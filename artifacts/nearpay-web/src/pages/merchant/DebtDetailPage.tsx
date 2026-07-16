import React from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Calendar, History, CheckCircle2, AlertCircle, Share2, MoreVertical, CreditCard, ChevronRight } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { mockDebts, mockCustomers } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function DebtDetailPage() {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const id = params.id;

  const debt = mockDebts.find(d => d.id === id) || mockDebts[0];
  const customer = mockCustomers.find(c => c.id === debt.customerId) || mockCustomers[0];

  const isOverdue = debt.status === 'overdue';
  const isSettled = debt.status === 'settled';

  const formattedDate = debt.date ? format(new Date(debt.date), 'MMM dd, yyyy') : '';
  const formattedDueDate = debt.dueDate ? format(new Date(debt.dueDate), 'MMM dd, yyyy') : '';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      
      <div className="px-6 py-4 flex items-center justify-between sticky top-[44px] z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/merchant/debts')} className="rounded-full -ml-3 hover:bg-secondary text-foreground">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tab Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-secondary/50 text-foreground">
            <Share2 size={18} />
          </Button>
        </div>
      </div>

      <div className="page-scroll">
        {/* Header Amount Card */}
        <div className="px-6 py-6 pb-8 bg-card border-b border-border shadow-sm rounded-b-[32px] relative z-10">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-background shadow-soft mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {customer.avatar}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{customer.name}</h2>
            <p className="text-sm font-medium text-muted-foreground mb-8 flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
              <Phone size={14} /> {customer.phone}
            </p>

            <div className={`rounded-[32px] p-8 w-full relative overflow-hidden shadow-soft border ${isOverdue ? 'bg-destructive/5 border-destructive/20' : isSettled ? 'bg-secondary/50 border-border' : 'bg-primary/5 border-primary/20'}`}>
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">{isSettled ? 'Settled Amount' : 'Unpaid Amount'}</p>
              <h3 className={`text-6xl font-bold tracking-tighter mb-4 ${isOverdue ? 'text-destructive' : isSettled ? 'text-foreground' : 'text-primary'}`}>
                {debt.amount}
              </h3>
              
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant={isOverdue ? "destructive" : isSettled ? "secondary" : "default"} className={`rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider text-[11px] shadow-sm ${isSettled ? 'bg-muted text-muted-foreground' : ''}`}>
                  {debt.status}
                </Badge>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider text-[11px] bg-background border-border shadow-sm">
                  {debt.category}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex w-full gap-3 mt-6">
              <Button variant="outline" className="flex-1 rounded-2xl h-14 gap-2 border-border font-bold bg-background shadow-sm hover:bg-secondary text-foreground">
                <MessageCircle size={20} className="text-[#25D366]" /> WhatsApp
              </Button>
              <Button variant="outline" className="flex-1 rounded-2xl h-14 gap-2 border-border font-bold bg-background shadow-sm hover:bg-secondary text-foreground">
                <Phone size={20} className="text-primary" /> Call
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8 bg-secondary/30 min-h-full">
          {/* Details */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest pl-2">Tab Information</h3>
            <div className="bg-card rounded-[24px] border border-border p-5 space-y-5 shadow-soft">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <span className="font-semibold text-sm">Created Date</span>
                </div>
                <span className="font-bold text-foreground text-sm">{formattedDate}</span>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-secondary'}`}>
                    <AlertCircle size={16} />
                  </div>
                  <span className="font-semibold text-sm">Due Date</span>
                </div>
                <span className={`font-bold text-sm ${isOverdue ? "text-destructive" : "text-foreground"}`}>
                  {formattedDueDate}
                </span>
              </div>
              
              {debt.notes && (
                <>
                  <div className="h-px bg-border w-full" />
                  <div className="flex justify-between items-start pt-1">
                    <span className="font-semibold text-sm text-muted-foreground min-w-20 pt-1">Notes</span>
                    <span className="font-medium text-sm text-foreground text-right leading-relaxed">{debt.notes}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest pl-2">Activity History</h3>
            <div className="bg-card rounded-[24px] border border-border p-6 shadow-soft">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-border">
                {isOverdue && (
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-destructive ring-4 ring-card" />
                    <p className="font-bold text-sm text-destructive mb-0.5">Marked Overdue</p>
                    <p className="text-xs text-muted-foreground font-medium">{formattedDueDate} • Automated status update</p>
                  </div>
                )}
                <div className="relative pl-10">
                  <div className="absolute left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card" />
                  <p className="font-bold text-sm text-foreground mb-0.5">Tab Created</p>
                  <p className="text-xs text-muted-foreground font-medium">{formattedDate} • Initial entry by {mockCustomers[0].name}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-24" /> {/* Spacer for bottom button */}
        </div>
      </div>

      {!isSettled && (
        <div className="absolute bottom-0 w-full p-6 bg-background/90 backdrop-blur-xl border-t border-border z-50 rounded-t-[32px]">
          <Button className="w-full h-14 rounded-[20px] text-lg font-bold shadow-lg hover-elevate gap-2 bg-primary text-primary-foreground">
            <CreditCard size={20} />
            Record Payment
          </Button>
        </div>
      )}
    </div>
  );
}