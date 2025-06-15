import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';

interface LanguageContextType {
  currentData: any;
  isLoading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialData: any;
  fetchFunction: (locale: string) => Promise<any>;
  routeName?: string;
}> = ({ children, initialData, fetchFunction }) => {
  const router = useRouter();
  const [currentData, setCurrentData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache to store data for each locale
  const [localeCache, setLocaleCache] = useState<Record<string, any>>({
    [router.locale || 'en']: initialData,
  });

  const refetchData = useCallback(
    async (locale: string) => {
      // If we have cached data for this locale, use it immediately
      if (localeCache[locale]) {
        setCurrentData(localeCache[locale]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFunction(locale);

        // Cache the new data
        setLocaleCache((prev) => ({
          ...prev,
          [locale]: newData,
        }));

        setCurrentData(newData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error refetching data:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, localeCache]
  );

  // Listen for locale changes
  useEffect(() => {
    if (router.locale && router.isReady) {
      refetchData(router.locale);
    }
  }, [router.locale, router.isReady, refetchData]);

  return (
    <LanguageContext.Provider value={{ currentData, isLoading, error }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageData = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageData must be used within a LanguageProvider');
  }
  return context;
};

export function withLanguageContext<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fetchFunction: (locale: string) => Promise<any>,
  routeName?: string
) {
  return function WrappedComponent(props: T) {
    return (
      <LanguageProvider
        initialData={props.pageData}
        fetchFunction={fetchFunction}
        routeName={routeName}
      >
        <Component {...props} />
      </LanguageProvider>
    );
  };
}
