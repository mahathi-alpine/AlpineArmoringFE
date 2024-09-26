import { useEffect, useState } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const COOKIE_NAME = 'googtrans';

export interface LanguageDescriptor {
  name: string;
  title: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => void;
  languageConfig: LanguageConfig;
};

const languageConfig: LanguageConfig = {
  languages: [
    { title: 'En', name: 'en' },
    { title: 'Es', name: 'es' },
    { title: 'Fr', name: 'fr' },
    { title: 'Ru', name: 'ru' },
    { title: 'CN', name: 'zh-CN' },
    { title: 'JA', name: 'ja' },
    { title: 'AR', name: 'ar' },
    { title: 'De', name: 'de' },
  ],
  defaultLanguage: 'en',
};

export const useLanguageSwitcher = (): UseLanguageSwitcherResult => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    languageConfig.defaultLanguage
  );

  useEffect(() => {
    const cookieValue = getCookie(COOKIE_NAME) as string | undefined;
    if (cookieValue) {
      const lang = cookieValue.split('/').pop();
      if (lang && languageConfig.languages.some((l) => l.name === lang)) {
        setCurrentLanguage(lang);
      }
    }
  }, []);

  const switchLanguage = (lang: string) => {
    if (lang === languageConfig.defaultLanguage) {
      deleteCookie(COOKIE_NAME, {
        path: '/',
        domain: 'alpineco.com',
      });
    } else {
      setCookie(COOKIE_NAME, `/auto/${lang}`, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: 'alpineco.com',
      });
    }
    setCurrentLanguage(lang);
    window.location.reload();
  };

  return {
    currentLanguage,
    switchLanguage,
    languageConfig,
  };
};

export default useLanguageSwitcher;
