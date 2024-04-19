import { useEffect, useState } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const COOKIE_NAME = 'googtrans';

export interface LanguageDescriptor {
  name: string;
  title: string;
  flag: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig | undefined;
};

export const getLanguageConfig = (): LanguageConfig | undefined => {
  let cfg: LanguageConfig | undefined;

  if (process.env.GOOGLE_TRANSLATION_CONFIG) {
    try {
      cfg = JSON.parse(process.env.GOOGLE_TRANSLATION_CONFIG ?? '{}');
    } catch (e) {
      console.log(e);
    }
  }

  return cfg;
};

export const useLanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('');

  useEffect(() => {
    const cfg = getLanguageConfig();
    const existingLanguageCookieValue = decodeURIComponent(
      getCookie(COOKIE_NAME)
    );

    let languageValue = '';
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split('/');
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    if (cfg && !languageValue) {
      languageValue = cfg.defaultLanguage;
    }
    setCurrentLanguage(languageValue);
  }, []);

  const switchLanguage = (lang: string) => () => {
    setCookie(COOKIE_NAME, '/auto/' + lang);
    if (getCookie(COOKIE_NAME) == '/auto/en') {
      deleteCookie(COOKIE_NAME);
    }
    window.location.reload();
  };

  return {
    currentLanguage,
    switchLanguage,
    languageConfig: getLanguageConfig(),
  };
};

export default useLanguageSwitcher;
