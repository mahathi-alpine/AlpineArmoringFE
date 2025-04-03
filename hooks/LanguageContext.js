import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale, events } = router;
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Update current locale state when router locale changes
  useEffect(() => {
    if (locale !== currentLocale) {
      setCurrentLocale(locale);
    }
  }, [locale, currentLocale]);

  // Track language change events to trigger refetches
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      // Check if this is a language change
      const urlLocale = url.split('/')[1];
      if (urlLocale && urlLocale.length === 2 && urlLocale !== currentLocale) {
        setIsChangingLanguage(true);
      }
    };

    const handleRouteChangeComplete = () => {
      setIsChangingLanguage(false);
    };

    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [events, currentLocale]);

  const value = {
    currentLocale,
    isChangingLanguage,
    // Add other language-related functionality here
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
