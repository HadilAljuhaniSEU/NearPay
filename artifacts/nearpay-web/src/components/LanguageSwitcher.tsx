import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const LanguageSwitcher = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [open, setOpen] = useState(false);

  const toggleLang = (newLang: 'en' | 'ar') => {
    setLang(newLang);
    if (newLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 text-foreground text-sm font-medium hover:bg-secondary transition-colors shadow-sm border border-border"
      >
        <Globe size={16} />
        {lang === 'en' ? 'EN' : 'العربية'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-2xl shadow-soft z-50 overflow-hidden"
          >
            <button 
              onClick={() => toggleLang('en')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${lang === 'en' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground'}`}
            >
              English
            </button>
            <button 
              onClick={() => toggleLang('ar')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${lang === 'ar' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground'}`}
            >
              العربية
            </button>
            <button 
              disabled
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60"
            >
              اردو
              <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Soon</span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};
