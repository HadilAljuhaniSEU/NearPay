import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getT, LangKey, TranslationKey } from '../i18n/translations';

interface LanguageContextValue {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  isRTL: boolean;
  t: (key: TranslationKey, ...args: string[]) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  isRTL: false,
  t: (key) => key as string,
});

export const useLanguage = () => useContext(LanguageContext);

/** Shorthand hook — returns just the t() function */
export const useT = () => useContext(LanguageContext).t;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LangKey>(() => {
    return (localStorage.getItem('nearpay_lang') as LangKey) ?? 'en';
  });

  const isRTL = lang === 'ar';

  const setLang = (l: LangKey) => {
    setLangState(l);
    localStorage.setItem('nearpay_lang', l);
  };

  const t = useCallback(
    (key: TranslationKey, ...args: string[]) => getT(lang)(key, ...args),
    [lang]
  );

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
    <LanguageContext.Provider value={{ lang, isRTL, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
