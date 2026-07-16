import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Bell, MessageSquare, Smartphone, Shield, CircleDollarSign, HelpCircle, Store } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockMerchant } from '../../data/mock';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';
import { NearPayLogo } from '../../components/NearPayLogo';

export default function MerchantSettingsPage() {
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="Menu" showLanguage={true} />

      <div className="page-scroll px-6 py-6 pb-32 bg-secondary/30">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Profile Card */}
          <motion.div variants={item} className="bg-card rounded-[24px] p-5 flex items-center gap-4 border border-border shadow-soft group cursor-pointer hover:border-primary/20 transition-colors">
            <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">AK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-lg mb-0.5">{mockMerchant.englishName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Store size={14} /> Grocery <span className="w-1 h-1 rounded-full bg-border" /> Riyadh
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight size={20} />
            </div>
          </motion.div>

          {/* Business Info */}
          <motion.div variants={item} className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-bold text-foreground">Business Details</h3>
            </div>
            {[
              { label: 'Business Name', value: mockMerchant.englishName },
              { label: 'Category', value: 'Grocery' },
              { label: 'City', value: 'Riyadh' },
              { label: 'Phone', value: '+966 50 111 2222' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <span className="text-sm font-semibold text-muted-foreground">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{row.value}</span>
                  <ChevronRight size={16} className="text-muted-foreground/50" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Preferences */}
          <motion.div variants={item} className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-bold text-foreground">Preferences</h3>
            </div>
            {[
              { label: 'Push Notifications', sub: 'Debt & payment alerts', icon: Bell, value: notifs, set: setNotifs },
              { label: 'Auto Reminders', sub: 'Send to overdue customers', icon: MessageSquare, value: reminders, set: setReminders },
              { label: 'SMS Alerts', sub: 'Text message notifications', icon: Smartphone, value: sms, set: setSms },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <row.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{row.label}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{row.sub}</p>
                </div>
                <Switch
                  checked={row.value}
                  onCheckedChange={row.set}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </motion.div>

          {/* Account */}
          <motion.div variants={item} className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h3 className="text-sm font-bold text-foreground">Account</h3>
            </div>
            {[
              { label: 'Payment Methods', icon: CircleDollarSign },
              { label: 'Security & Privacy', icon: Shield },
              { label: 'Help & Support', icon: HelpCircle },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <row.icon size={18} className="text-muted-foreground" />
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
              className="w-full flex items-center justify-center gap-2 bg-destructive/5 text-destructive border border-destructive/20 rounded-[20px] py-4 font-bold text-base shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              Sign Out
            </button>
          </motion.div>
          
          <div className="flex flex-col items-center justify-center py-6 opacity-60">
            <NearPayLogo size={24} className="mb-2 grayscale" />
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Version 1.0.0</p>
          </div>
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}