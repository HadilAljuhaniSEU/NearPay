import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Bell, MessageSquare, Smartphone } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { mockMerchant } from '../../data/mock';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';

export default function MerchantSettingsPage() {
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title="Settings" />

      <div className="page-scroll px-6 py-4">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Profile Card */}
          <motion.div variants={item} className="bg-foreground rounded-[20px] p-5 flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">AK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-background text-base">{mockMerchant.name}</p>
              <p className="text-sm text-background/60 mt-0.5">{mockMerchant.englishName}</p>
              <p className="text-xs text-background/40 mt-0.5">Grocery · Riyadh</p>
            </div>
            <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <ChevronRight size={16} className="text-background/60" />
            </button>
          </motion.div>

          {/* Business Info */}
          <motion.div variants={item} className="bg-card border border-border rounded-[18px] overflow-hidden">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-widest px-5 pt-4 pb-2 uppercase">Business</p>
            {[
              { label: 'Business Name', value: mockMerchant.englishName },
              { label: 'Category', value: 'Grocery' },
              { label: 'City', value: 'Riyadh' },
              { label: 'Phone', value: '+966 50 111 2222' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Notifications */}
          <motion.div variants={item} className="bg-card border border-border rounded-[18px] overflow-hidden">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-widest px-5 pt-4 pb-2 uppercase">Notifications</p>
            {[
              { label: 'Push Notifications', sub: 'Debt & payment alerts', icon: Bell, value: notifs, set: setNotifs },
              { label: 'Payment Reminders', sub: 'Auto-send to customers', icon: MessageSquare, value: reminders, set: setReminders },
              { label: 'SMS Alerts', sub: 'Text message reminders', icon: Smartphone, value: sms, set: setSms },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center gap-3 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <row.icon size={15} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.sub}</p>
                </div>
                <Switch
                  checked={row.value}
                  onCheckedChange={row.set}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </motion.div>

          {/* About */}
          <motion.div variants={item} className="bg-card border border-border rounded-[18px] overflow-hidden">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-widest px-5 pt-4 pb-2 uppercase">NearPay</p>
            {[
              { label: 'Version', value: '1.0.0 · MVP' },
              { label: 'Privacy Policy', chevron: true },
              { label: 'Terms of Service', chevron: true },
              { label: 'Support', value: 'support@nearpay.sa' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="text-sm font-medium text-foreground">{row.label}</span>
                <div className="flex items-center gap-1.5">
                  {row.value && <span className="text-sm text-muted-foreground">{row.value}</span>}
                  {row.chevron && <ChevronRight size={14} className="text-muted-foreground" />}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={item}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-[18px] py-4 font-semibold text-sm hover:bg-destructive/15 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </motion.div>

          <div className="h-8" />
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
