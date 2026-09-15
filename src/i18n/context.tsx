import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import arData from '../locales/ar.json';
import enData from '../locales/en.json';

export type Lang = 'ar' | 'en';
export type Dir = 'rtl' | 'ltr';

interface I18nContextValue {
  lang: Lang;
  dir: Dir;
  isRtl: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  switchLangUrl: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const lang: Lang = useMemo(() => {
    if (location.pathname.startsWith('/en')) {
      return 'en';
    }
    return 'ar';
  }, [location.pathname]);

  const dir: Dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRtl = lang === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang, dir]);

  const dict = lang === 'ar' ? arData : enData;

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): any => {
      let val = getNestedValue(dict, key);
      if (val === undefined) {
        val = getNestedValue(arData, key);
      }
      if (val === undefined) {
        return key;
      }
      if (typeof val === 'string' && params) {
        let str = val;
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
        return str;
      }
      return val;
    };
  }, [dict]);

  const switchLangUrl = useMemo(() => {
    const pathname = location.pathname;
    const targetLang: Lang = lang === 'ar' ? 'en' : 'ar';
    if (pathname.startsWith('/ar')) {
      return pathname.replace(/^\/ar(\/|$)/, `/${targetLang}$1`);
    } else if (pathname.startsWith('/en')) {
      return pathname.replace(/^\/en(\/|$)/, `/${targetLang}$1`);
    } else {
      return `/${targetLang}/`;
    }
  }, [location.pathname, lang]);

  const contextValue: I18nContextValue = {
    lang,
    dir,
    isRtl,
    t,
    switchLangUrl,
  };

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

export function useT() {
  const { t } = useI18n();
  return t;
}

export function useLang() {
  const { lang, dir, isRtl, switchLangUrl } = useI18n();
  return { lang, dir, isRtl, switchLangUrl };
}
