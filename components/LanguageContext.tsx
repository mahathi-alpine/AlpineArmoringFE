import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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

  const cacheRef = useRef<Record<string, any>>({
    [router.locale || 'en']: initialData,
  });

  useEffect(() => {
    setCurrentData(initialData);

    if (router.locale) {
      cacheRef.current[router.locale] = initialData;
    }
  }, [initialData, router.locale]);

  const refetchData = useCallback(
    async (locale: string) => {
      if (locale === router.locale && initialData) {
        return;
      }

      if (cacheRef.current[locale]) {
        setCurrentData(cacheRef.current[locale]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFunction(locale);
        cacheRef.current[locale] = newData;
        setCurrentData(newData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, router.locale, initialData]
  );

  useEffect(() => {
    if (router.locale) {
      refetchData(router.locale);
    }
  }, [router.locale, refetchData]);

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
        initialData={props.pageData || props} // Handle both structures: direct pageData or full props
        fetchFunction={fetchFunction}
        routeName={routeName}
      >
        <Component {...props} />
      </LanguageProvider>
    );
  };
}
