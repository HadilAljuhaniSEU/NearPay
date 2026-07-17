import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, History, Settings, Bell } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useT } from '../../contexts/LanguageContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { signOutMerchant } from '../../services/authService';

export default function CustomerProfilePage() {
  const [_, setLocation] = useLocation();
  const t = useT();
  const { user } = useAuthContext();

  // Derive display values from Firebase auth user (email or phone)
  const email       = user?.email ?? '';
  const phone       = user?.phoneNumber ?? '';
  const displayName = user?.displayName?.trim() || '';
  const identifier  = email || phone;
  const initials    = displayName
    ? displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : (email ? email[0].toUpperCase() : phone.replace(/\D/g, '').slice(-2));

  const handleLogout = async () => {
    try {
      await signOutMerchant(); // signOut(auth) — works for any Firebase user
    } catch {
      // ignore
    }
    setLocation('/login');
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('profile_title')} showLanguage={true} />

      <div className="page-scroll px-5 py-5 pb-32">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Profile Card */}
          <motion.div variants={item} className="bg-card rounded-[22px] p-6 flex flex-col items-center text-center shadow-sm border border-border/60 relative overflow-hidden">
            <div className="absolute top-0 w-full h-20 pointer-events-none"
                 style={{ background: 'linear-gradient(to bottom, rgba(32,214,199,0.08), transparent)' }} />
            <Avatar className="h-20 w-20 border-4 border-background shadow-md mb-4 relative z-10">
              <AvatarFallback className="bg-foreground text-background text-2xl font-bold">
                {initials || '?'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">
              {displayName || t('customer')}
            </h2>
            <p className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {identifier}
            </p>
          </motion.div>

          {/* NearPay Score */}
          <motion.div variants={item} className="rounded-[22px] p-6 text-white relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #0B2341 0%, #143B63 100%)', boxShadow: '0 6px 24px rgba(11,35,65,0.25)' }}>
            <div className="absolute top-0 end-0 w-40 h-40 rounded-full blur-2xl -me-10 -mt-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(32,214,199,0.2), transparent)' }} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">{t('nearpay_score')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">—</span>
                  <span className="text-lg font-bold opacity-60">/100</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-[18px] flex items-center justify-center border"
                   style={{ background: 'rgba(32,214,199,0.15)', borderColor: 'rgba(32,214,199,0.3)' }}>
                <ShieldCheck size={30} style={{ color: '#20D6C7' }} />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-2 text-xs font-bold rounded-xl px-3 py-2"
                 style={{ background: 'rgba(32,214,199,0.1)' }}>
              <CheckCircle2 size={15} style={{ color: '#20D6C7' }} />
              <span style={{ color: '#20D6C7' }}>{t('excellent_history')}</span>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div variants={item} className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('account_section')}</h3>
            </div>
            {[
              { labelKey: 'account_payment_methods', icon: CreditCard },
              { labelKey: 'payment_history_title',   icon: History },
              { labelKey: 'pref_push_notifs',        icon: Bell },
              { labelKey: 'preferences_title',       icon: Settings },
            ].map((row, i, arr) => (
              <div
                key={row.labelKey}
                className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <row.icon size={15} className="text-foreground" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{t(row.labelKey as any)}</span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/40 rtl-flip" />
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
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
