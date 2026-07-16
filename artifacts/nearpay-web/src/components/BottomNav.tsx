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
    { id: 'debts', label: 'My Tabs', icon: Wallet, path: '/customer/debts' },
    { id: 'payments', label: 'History', icon: CreditCard, path: '/customer/payments' },
    { id: 'profile', label: 'Profile', icon: User, path: '/customer/profile' },
  ];

  const tabs = role === 'merchant' ? merchantTabs : customerTabs;

  return (
    <div className="absolute bottom-0 w-full bg-background/90 backdrop-blur-xl border-t border-border pb-6 pt-2 px-2 z-50">
      <div className="flex items-center justify-around w-full relative">
        {tabs.map((tab) => {
          const isActive = location === tab.path || (tab.path !== '/' && location.startsWith(tab.path + '/'));
          const Icon = tab.icon;

          return (
            <Link key={tab.id} href={tab.path} className="relative flex flex-col items-center justify-center w-full focus:outline-none">
              <div className={`relative flex flex-col items-center gap-1 p-2 w-full h-full ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}`}>
                {isActive && (
                  <motion.div
                    layoutId="navBubble"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
