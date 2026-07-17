import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { BottomNav } from '../../components/BottomNav';
import { PageHeader } from '../../components/PageHeader';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useT } from '../../contexts/LanguageContext';

export default function PreferencesPage() {
  const t = useT();

  return (
    <div className="app-container flex flex-col bg-background">
      <StatusBar />
      <PageHeader title={t('preferences_title')} />

      <div className="page-scroll px-5 py-5 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Language setting */}
          <div className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('pref_language')}</h3>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                  <Globe size={15} className="text-foreground" />
                </div>
                <span className="text-sm font-bold text-foreground">{t('pref_language')}</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* More settings coming soon */}
          <div className="bg-card border border-border/60 rounded-[22px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border/50 bg-secondary/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t('pref_push_notifs')}</h3>
            </div>
            <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-secondary flex items-center justify-center">
                <Settings size={20} className="text-muted-foreground/60" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">{t('coming_soon_sub')}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
