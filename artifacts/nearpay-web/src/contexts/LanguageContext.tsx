import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('nearpay_lang') as Language) ?? 'en';
  });

  const isRTL = lang === 'ar';

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('nearpay_lang', l);
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isRTL) {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      body.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      body.classList.remove('rtl');
    }
  }, [isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, isRTL, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
