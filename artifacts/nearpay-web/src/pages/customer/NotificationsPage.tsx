import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { useT } from '../../contexts/LanguageContext';

export default function NotificationsPage() {
  const t = useT();

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('notifications_title')} />

      <div className="page-scroll px-5 py-5 pb-32 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-[20px] bg-secondary flex items-center justify-center">
            <Bell size={28} className="text-muted-foreground/60" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('no_notifications')}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 max-w-[260px] mx-auto leading-relaxed">
              {t('notifications_sub')}
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
