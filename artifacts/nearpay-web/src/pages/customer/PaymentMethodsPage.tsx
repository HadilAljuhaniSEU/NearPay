import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { useT } from '../../contexts/LanguageContext';
import { useLocation } from 'wouter';

export default function PaymentMethodsPage() {
  const t = useT();
  const [_, setLocation] = useLocation();

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('account_payment_methods')} />

      <div className="page-scroll px-5 py-5 pb-32 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-[20px] bg-secondary flex items-center justify-center">
            <CreditCard size={28} className="text-muted-foreground/60" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('no_payment_methods')}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 max-w-[260px] mx-auto leading-relaxed">
              {t('payment_methods_sub')}
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
