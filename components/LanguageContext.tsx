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

  const cacheRef = useRef<Record<string, any>>({});
  const initialDataRef = useRef(initialData);

  // Update refs when initialData changes
  useEffect(() => {
    initialDataRef.current = initialData;
    if (router.locale && initialData) {
      cacheRef.current[router.locale] = initialData;
    }
  }, [initialData, router.locale]);

  // Update current data when initialData changes (for SSG pages)
  useEffect(() => {
    if (initialData) {
      setCurrentData(initialData);
    }
  }, [initialData]);

  const refetchData = useCallback(
    async (locale: string) => {
      // If we're switching to the current locale and have fresh initial data, use it
      if (locale === router.locale && initialDataRef.current) {
        setCurrentData(initialDataRef.current);
        return;
      }

      // Check cache first
      if (cacheRef.current[locale]) {
        setCurrentData(cacheRef.current[locale]);
        return;
      }

      // For non-default locales in production, we need to fetch data
      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFunction(locale);

        if (newData) {
          cacheRef.current[locale] = newData;
          setCurrentData(newData);
        } else {
          // If fetch returns null/undefined, keep current data
          if (!currentData && initialDataRef.current) {
            setCurrentData(initialDataRef.current);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);

        // Fallback to initial data if available
        if (initialDataRef.current) {
          setCurrentData(initialDataRef.current);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, router.locale, currentData]
  );

  // Handle locale changes
  useEffect(() => {
    if (router.locale) {
      // Small delay to ensure router is fully ready
      const timer = setTimeout(() => {
        refetchData(router.locale);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [router.locale, refetchData]);

  // Initialize cache with initial data
  useEffect(() => {
    if (initialData && router.locale) {
      cacheRef.current[router.locale] = initialData;
      setCurrentData(initialData);
    }
  }, []);

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
    // For pages like inventory, use the full props object
    // For pages like contact, use just the pageData
    const initialData = props.pageData ? props.pageData : props;

    return (
      <LanguageProvider
        initialData={initialData}
        fetchFunction={fetchFunction}
        routeName={routeName}
      >
        <Component {...props} />
      </LanguageProvider>
    );
  };
}
