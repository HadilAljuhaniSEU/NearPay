import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { lang, setLang, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (newLang: 'en' | 'ar') => {
    setLang(newLang);
    setOpen(false);
  };

  const label = lang === 'ar' ? 'العربية' : 'EN';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 text-foreground text-sm font-medium hover:bg-secondary transition-colors shadow-sm border border-border"
      >
        <Globe size={16} />
        {label}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute top-full mt-2 w-44 bg-card border border-border rounded-2xl shadow-soft z-50 overflow-hidden ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            {/* English */}
            <button
              onClick={() => handleSelect('en')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                lang === 'en' ? 'bg-primary/8 text-primary' : 'hover:bg-secondary text-foreground'
              }`}
            >
              {lang === 'en' && (
                <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className={lang === 'en' ? '' : 'pl-5'}>English</span>
            </button>

            {/* Arabic */}
            <button
              onClick={() => handleSelect('ar')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                lang === 'ar' ? 'bg-primary/8 text-primary' : 'hover:bg-secondary text-foreground'
              }`}
            >
              {lang === 'ar' && (
                <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className={lang === 'ar' ? '' : 'pl-5'}>العربية</span>
            </button>

            {/* Urdu — always displayed as "Urdu" in Latin, never Arabic script */}
            <button
              disabled
              className="w-full px-4 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60 flex items-center justify-between"
            >
              <span className="pl-5">Urdu</span>
              <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                Soon
              </span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};
