import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { useT } from '../../contexts/LanguageContext';

export default function ComingSoonPage() {
  const t = useT();

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <div className="page-scroll px-5 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <div className="w-20 h-20 rounded-[28px] bg-secondary flex items-center justify-center mx-auto">
            <Clock size={34} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t('coming_soon_title')}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-[260px] mx-auto leading-relaxed">
              {t('coming_soon_sub')}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mx-auto text-sm font-bold text-primary hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={16} className="rtl-flip" />
            {t('go_back')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
