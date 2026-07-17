import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Home, Wallet, Users, PieChart, Sparkles, Settings,
  MapPin, CreditCard, User, Compass,
} from 'lucide-react';
import { useT } from '../contexts/LanguageContext';

export const BottomNav = ({ role }: { role: 'merchant' | 'customer' }) => {
  const [location] = useLocation();
  const t = useT();

  const merchantTabs = [
    { id: 'dashboard', labelKey: 'nav_home' as const,    icon: Home,     path: '/merchant/dashboard' },
    { id: 'debts',     labelKey: 'nav_tabs' as const,    icon: Wallet,   path: '/merchant/debts' },
    { id: 'customers', labelKey: 'nav_clients' as const, icon: Users,    path: '/merchant/customers' },
    { id: 'analytics', labelKey: 'nav_stats' as const,   icon: PieChart, path: '/merchant/analytics' },
    { id: 'ai',        labelKey: 'nav_ai' as const,      icon: Sparkles, path: '/merchant/ai' },
    { id: 'settings',  labelKey: 'nav_menu' as const,    icon: Settings, path: '/merchant/settings' },
  ];

  const customerTabs = [
    { id: 'home',     labelKey: 'nav_home' as const,     icon: Home,      path: '/customer/home' },
    { id: 'nearby',   labelKey: 'nav_discover' as const, icon: Compass,   path: '/customer/nearby' },
    { id: 'debts',    labelKey: 'nav_tabs' as const,     icon: Wallet,    path: '/customer/debts' },
    { id: 'payments', labelKey: 'nav_history' as const,  icon: CreditCard,path: '/customer/payments' },
    { id: 'profile',  labelKey: 'nav_profile' as const,  icon: User,      path: '/customer/profile' },
  ];

  const tabs = role === 'merchant' ? merchantTabs : customerTabs;

  return (
    <div className="absolute bottom-0 w-full bg-background/90 backdrop-blur-2xl border-t border-border pb-6 pt-2.5 px-2 z-50 rounded-b-[32px]"
         style={{ boxShadow: '0 -1px 0 0 rgba(11,35,65,0.06)' }}>
      <div className="flex items-center justify-between w-full relative">
        {tabs.map((tab) => {
          const isActive = location === tab.path || (tab.path !== '/' && location.startsWith(tab.path + '/'));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="relative flex flex-col items-center justify-center flex-1 focus:outline-none group bottom-nav-tab"
            >
              <div className="relative flex flex-col items-center gap-1 py-1 w-full">
                <div className={`relative flex items-center justify-center w-11 h-8 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-navy' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {isActive && (
                    <motion.div
                      layoutId={`bottomNavIndicator-${role}`}
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg, rgba(32,214,199,0.18) 0%, rgba(25,184,211,0.14) 100%)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} className="relative z-10" />
                </div>
                <span className={`text-[9.5px] font-semibold transition-colors leading-none ${
                  isActive ? 'text-navy' : 'text-muted-foreground'
                }`}>
                  {t(tab.labelKey)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
