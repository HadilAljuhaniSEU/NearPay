import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, History, Settings, Bell } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockCustomerProfile } from '../../data/mock';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function CustomerProfilePage() {
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="Profile" showLanguage={true} />
      
      <div className="page-scroll px-6 py-6 pb-32 bg-secondary/30">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Profile Card */}
          <motion.div variants={item} className="bg-card rounded-[24px] p-6 flex flex-col items-center text-center shadow-soft border border-border relative overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent" />
            <Avatar className="h-24 w-24 border-4 border-background shadow-md mb-4 relative z-10">
              <AvatarFallback className="bg-foreground text-background text-3xl font-bold">
                {mockCustomerProfile.avatar}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{mockCustomerProfile.name}</h2>
            <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">{mockCustomerProfile.phone}</p>
          </motion.div>

          {/* NearPay Score */}
          <motion.div variants={item} className="bg-gradient-to-br from-primary to-[#108239] rounded-[24px] p-6 text-primary-foreground shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold opacity-90 uppercase tracking-widest mb-1">NearPay Score</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">{mockCustomerProfile.score}</span>
                  <span className="text-xl font-bold opacity-70">/100</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                <ShieldCheck size={36} className="text-white" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 text-sm font-bold bg-black/5 rounded-xl px-4 py-2">
              <CheckCircle2 size={18} className="text-white" />
              Excellent payment history
            </div>
          </motion.div>

          {/* Menu Sections */}
          <motion.div variants={item} className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-bold text-foreground">Account Settings</h3>
            </div>
            {[
              { label: 'Payment Methods', icon: CreditCard },
              { label: 'Payment History', icon: History },
              { label: 'Notifications', icon: Bell },
              { label: 'Preferences', icon: Settings },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <row.icon size={16} className="text-foreground" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{row.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/50" />
              </div>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={item} className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-card text-destructive border border-destructive/20 rounded-[20px] py-4 font-bold text-base shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}