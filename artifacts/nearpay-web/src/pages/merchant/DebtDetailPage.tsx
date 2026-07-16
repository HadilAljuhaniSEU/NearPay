import React from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Calendar, History, CheckCircle2, AlertCircle, Share2, MoreVertical } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { mockDebts, mockCustomers } from '../../data/mock';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function DebtDetailPage() {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const id = params.id;

  const debt = mockDebts.find(d => d.id === id) || mockDebts[0];
  const customer = mockCustomers.find(c => c.id === debt.customerId) || mockCustomers[0];

  const isOverdue = debt.status === 'overdue';

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      
      <div className="px-6 py-4 flex items-center justify-between sticky top-[44px] z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/merchant/debts')} className="rounded-full">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Tab Details</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-foreground">
          <MoreVertical size={20} />
        </Button>
      </div>

      <div className="page-scroll">
        {/* Header Amount Card */}
        <div className="px-6 py-8 bg-card border-b border-border/50">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-sm mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {customer.avatar}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground mb-1">{customer.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{customer.phone}</p>

            <div className="bg-secondary/50 rounded-3xl p-6 w-full relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${isOverdue ? 'bg-destructive' : 'bg-primary'}`} />
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Unpaid Amount</p>
              <h3 className={`text-5xl font-bold tracking-tight mb-3 ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                SAR {debt.amount}
              </h3>
              
              <div className="flex justify-center gap-2">
                <Badge variant={isOverdue ? "destructive" : "default"} className="rounded-lg px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                  {debt.status}
                </Badge>
                <Badge variant="outline" className="rounded-lg px-3 py-1 font-semibold uppercase tracking-wider text-[10px] bg-background">
                  {debt.category}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex w-full gap-3 mt-6">
              <Button variant="outline" className="flex-1 rounded-2xl h-12 gap-2 border-border font-semibold">
                <MessageCircle size={18} /> WhatsApp
              </Button>
              <Button variant="outline" className="flex-1 rounded-2xl h-12 gap-2 border-border font-semibold">
                <Phone size={18} /> Call
              </Button>
              <Button variant="outline" className="w-12 h-12 rounded-2xl p-0 border-border">
                <Share2 size={18} className="text-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Details */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Tab Information</h3>
            <div className="bg-card rounded-[20px] border border-card-border p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar size={18} />
                  <span className="font-medium text-sm">Created Date</span>
                </div>
                <span className="font-semibold text-foreground text-sm">{new Date(debt.date).toLocaleDateString()}</span>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <AlertCircle size={18} className={isOverdue ? "text-destructive" : ""} />
                  <span className="font-medium text-sm">Due Date</span>
                </div>
                <span className={`font-bold text-sm ${isOverdue ? "text-destructive" : "text-foreground"}`}>
                  {new Date(debt.dueDate).toLocaleDateString()}
                </span>
              </div>
              {debt.notes && (
                <>
                  <div className="h-px bg-border w-full" />
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-muted-foreground min-w-20">Notes</span>
                    <span className="font-medium text-sm text-foreground text-right">{debt.notes}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline Placeholder */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
              <History size={16} /> History
            </h3>
            <div className="space-y-4 pl-2 border-l-2 border-border ml-2">
              <div className="relative pl-6">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-semibold text-sm text-foreground">Tab Created</p>
                <p className="text-xs text-muted-foreground">{new Date(debt.date).toLocaleDateString()} • SAR {debt.amount}</p>
              </div>
              {isOverdue && (
                <div className="relative pl-6">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-destructive ring-4 ring-background" />
                  <p className="font-semibold text-sm text-destructive">Marked Overdue</p>
                  <p className="text-xs text-muted-foreground">{new Date(debt.dueDate).toLocaleDateString()} • Reminder sent</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-6 bg-background/90 backdrop-blur-xl border-t border-border">
        <Button className="w-full h-14 rounded-[18px] text-lg font-bold shadow-lg hover-elevate gap-2">
          <CheckCircle2 size={20} />
          Mark as Settled
        </Button>
      </div>
    </div>
  );
}
