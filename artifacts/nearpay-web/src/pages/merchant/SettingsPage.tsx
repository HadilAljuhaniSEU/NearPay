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
import { useT } from '../../contexts/LanguageContext';

export default function MerchantSettingsPage() {
  const [notifs, setNotifs]       = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms]             = useState(false);
  const [, setLocation]           = useLocation();
  const t = useT();

  const handleLogout = () => {
    localStorage.removeItem('nearpay_role');
    setLocation('/login');
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('menu_title')} showLanguage={true} />

      <div className="page-scroll px-5 py-5 pb-32 bg-secondary/20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Profile Card */}
          <motion.div variants={item} className="bg-card rounded-[22px] p-5 flex items-center gap-4 border border-border/60 shadow-sm group cursor-pointer hover:border-teal/30 transition-colors">
            <Avatar className="h-14 w-14 border-2 border-border/40">
              <AvatarFallback className="bg-primary/8 text-primary font-bold text-lg">AK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-base mb-0.5">{mockMerchant.englishName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Store size={12} /> {t('grocery_cat')} <span className="w-1 h-1 rounded-full bg-border" /> {t('riyadh_city')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <ChevronRight size={18} className="rtl-flip" />
            </div>
          </motion.div>

          {/* Business Info */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('business_details')}</h3>
            </div>
            {[
              { labelKey: 'biz_name',  value: mockMerchant.englishName },
              { labelKey: 'biz_cat',   value: t('grocery_cat') },
              { labelKey: 'biz_city',  value: t('riyadh_city') },
              { labelKey: 'biz_phone', value: '+966 50 111 2222' },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <span className="text-sm font-semibold text-muted-foreground">{t(row.labelKey as any)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{row.value}</span>
                  <ChevronRight size={14} className="text-muted-foreground/40 rtl-flip" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Preferences */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('preferences_title')}</h3>
            </div>
            {[
              { labelKey: 'pref_push_notifs', subKey: 'pref_push_notifs_sub', icon: Bell,         value: notifs,    set: setNotifs },
              { labelKey: 'pref_auto_remind', subKey: 'pref_auto_remind_sub', icon: MessageSquare, value: reminders, set: setReminders },
              { labelKey: 'pref_sms_alerts',  subKey: 'pref_sms_alerts_sub',  icon: Smartphone,   value: sms,       set: setSms },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <row.icon size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{t(row.labelKey as any)}</p>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{t(row.subKey as any)}</p>
                </div>
                <Switch checked={row.value} onCheckedChange={row.set} className="data-[state=checked]:bg-primary" />
              </div>
            ))}
          </motion.div>

          {/* Account */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('account_section')}</h3>
            </div>
            {[
              { labelKey: 'account_payment_methods', icon: CircleDollarSign },
              { labelKey: 'account_security',        icon: Shield },
              { labelKey: 'account_help',             icon: HelpCircle },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <row.icon size={17} className="text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">{t(row.labelKey as any)}</span>
                </div>
                <ChevronRight size={15} className="text-muted-foreground/40 rtl-flip" />
              </div>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={item} className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-destructive/5 text-destructive border border-destructive/20 rounded-[18px] py-4 font-bold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform rtl-flip" />
              {t('sign_out')}
            </button>
          </motion.div>

          <div className="flex flex-col items-center justify-center py-4 opacity-50">
            <NearPayLogo size={20} className="mb-1.5 grayscale" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">{t('version_label')}</p>
          </div>
        </motion.div>
      </div>

      <BottomNav role="merchant" />
    </div>
  );
}
