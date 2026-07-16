import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockCustomerProfile } from '../../data/mock';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function CustomerProfilePage() {
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="Profile" />
      
      <div className="page-scroll px-6 py-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-[24px] p-6 flex flex-col items-center text-center shadow-sm border border-card-border">
          <Avatar className="h-20 w-20 border-4 border-background shadow-sm mb-4">
            <AvatarFallback className="bg-foreground text-background text-2xl font-bold">
              {mockCustomerProfile.avatar}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground mb-1">{mockCustomerProfile.name}</h2>
          <p className="text-sm text-muted-foreground">{mockCustomerProfile.phone}</p>
        </div>

        {/* NearPay Score */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[24px] p-6 text-primary-foreground shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold opacity-90 uppercase tracking-wider mb-1">NearPay Score</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{mockCustomerProfile.score}</span>
                <span className="text-lg opacity-80 font-medium">/100</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={16} />
            Excellent payment behavior
          </div>
        </div>

        {/* Menu Sections */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
            Payment Settings
          </h3>
          <div className="bg-card rounded-[20px] overflow-hidden border border-card-border shadow-sm">
            <button className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={18} />
                </div>
                <span className="font-semibold text-foreground text-sm">Payment Methods</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={handleLogout}
          className="w-full h-14 text-destructive font-bold text-sm bg-destructive/5 border-destructive/20 rounded-2xl hover:bg-destructive/10 transition-colors mt-8"
        >
          <LogOut size={18} className="mr-2" strokeWidth={2.5} />
          Log Out
        </Button>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
