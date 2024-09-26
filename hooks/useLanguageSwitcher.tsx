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
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig;
};

// This should match the structure in next.config.js
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
    const existingLanguageCookieValue = getCookie(COOKIE_NAME);

    let languageValue = languageConfig.defaultLanguage;
    if (existingLanguageCookieValue) {
      const sp = decodeURIComponent(
        existingLanguageCookieValue as string
      ).split('/');
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    setCurrentLanguage(languageValue);
  }, []);

  const switchLanguage = (lang: string) => () => {
    deleteCookie(COOKIE_NAME, {
      path: '/',
      domain: 'alpineco.com',
    });

    setCookie(COOKIE_NAME, '/auto/' + lang, {
      maxAge: 3600,
      path: '/',
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
      domain: 'alpineco.com',
    });

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
