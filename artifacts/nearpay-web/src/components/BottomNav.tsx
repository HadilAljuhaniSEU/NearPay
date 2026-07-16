import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Users, 
  PieChart, 
  Sparkles, 
  Settings,
  MapPin,
  CreditCard,
  User
} from 'lucide-react';

export const BottomNav = ({ role }: { role: 'merchant' | 'customer' }) => {
  const [location] = useLocation();

  const merchantTabs = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/merchant/dashboard' },
    { id: 'debts', label: 'Tabs', icon: Wallet, path: '/merchant/debts' },
    { id: 'customers', label: 'Clients', icon: Users, path: '/merchant/customers' },
    { id: 'analytics', label: 'Stats', icon: PieChart, path: '/merchant/analytics' },
    { id: 'ai', label: 'AI', icon: Sparkles, path: '/merchant/ai' },
    { id: 'settings', label: 'Menu', icon: Settings, path: '/merchant/settings' },
  ];

  const customerTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/customer/home' },
    { id: 'nearby', label: 'Nearby', icon: MapPin, path: '/customer/nearby' },
    { id: 'debts', label: 'Tabs', icon: Wallet, path: '/customer/debts' },
    { id: 'payments', label: 'History', icon: CreditCard, path: '/customer/payments' },
    { id: 'profile', label: 'Profile', icon: User, path: '/customer/profile' },
  ];

  const tabs = role === 'merchant' ? merchantTabs : customerTabs;

  return (
    <div className="absolute bottom-0 w-full bg-background/80 backdrop-blur-2xl border-t border-border pb-6 pt-3 px-4 z-50 rounded-b-[32px]">
      <div className="flex items-center justify-between w-full relative">
        {tabs.map((tab) => {
          const isActive = location === tab.path || (tab.path !== '/' && location.startsWith(tab.path + '/'));
          const Icon = tab.icon;

          return (
            <Link key={tab.id} href={tab.path} className="relative flex flex-col items-center justify-center flex-1 focus:outline-none group">
              <div className="relative flex flex-col items-center gap-1.5 py-1 w-full h-full">
                <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute inset-0 bg-primary/15 rounded-full"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{tab.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
