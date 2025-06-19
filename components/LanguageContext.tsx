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

// Debug function that only logs in development
const debugLog = (message: string, data?: any) => {
  if (typeof window !== 'undefined') {
    // Always log to console for debugging
    console.log(`[LanguageContext] ${message}`, data);

    // Also store in localStorage for production debugging
    try {
      const logs = JSON.parse(
        localStorage.getItem('langContext_debug') || '[]'
      );
      logs.push({
        timestamp: new Date().toISOString(),
        message,
        data: data
          ? {
              hasData: !!data,
              type: typeof data,
              keys: data && typeof data === 'object' ? Object.keys(data) : [],
              vehicleCount:
                data?.vehicles?.data?.length || data?.data?.length || 'N/A',
            }
          : null,
      });

      // Keep only last 50 logs
      if (logs.length > 50) logs.splice(0, logs.length - 50);

      localStorage.setItem('langContext_debug', JSON.stringify(logs));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialData: any;
  fetchFunction: (locale: string) => Promise<any>;
  routeName?: string;
}> = ({ children, initialData, fetchFunction, routeName }) => {
  const router = useRouter();
  const [currentData, setCurrentData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Record<string, any>>({});
  const initialDataRef = useRef(initialData);
  const isMountedRef = useRef(true);

  debugLog(`Provider initialized for route: ${routeName}`, {
    initialData,
    locale: router.locale,
    pathname: router.pathname,
    isReady: router.isReady,
  });

  // Update refs when initialData changes
  useEffect(() => {
    debugLog('InitialData changed', {
      newData: initialData,
      locale: router.locale,
      hasData: !!initialData,
    });

    initialDataRef.current = initialData;
    if (router.locale && initialData) {
      cacheRef.current[router.locale] = initialData;
      debugLog('Cache updated with initialData', {
        locale: router.locale,
        cacheKeys: Object.keys(cacheRef.current),
      });
    }
  }, [initialData, router.locale]);

  // Update current data when initialData changes
  useEffect(() => {
    if (initialData) {
      debugLog('Setting currentData from initialData', { initialData });
      setCurrentData(initialData);
    }
  }, [initialData]);

  const refetchData = useCallback(
    async (locale: string) => {
      if (!isMountedRef.current) return;

      debugLog(`RefetchData called for locale: ${locale}`, {
        currentLocale: router.locale,
        hasInitialData: !!initialDataRef.current,
        cacheKeys: Object.keys(cacheRef.current),
        routeName,
      });

      // If we're switching to the current locale and have fresh initial data, use it
      if (locale === router.locale && initialDataRef.current) {
        debugLog('Using initial data for current locale', {
          locale,
          data: initialDataRef.current,
        });
        setCurrentData(initialDataRef.current);
        return;
      }

      // Check cache first
      if (cacheRef.current[locale]) {
        debugLog('Using cached data', {
          locale,
          data: cacheRef.current[locale],
        });
        setCurrentData(cacheRef.current[locale]);
        return;
      }

      // Fetch new data
      debugLog('Fetching new data', { locale, fetchFunction: !!fetchFunction });
      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFunction(locale);

        debugLog('Fetch completed', {
          locale,
          success: !!newData,
          data: newData,
        });

        if (!isMountedRef.current) return;

        if (newData) {
          cacheRef.current[locale] = newData;
          setCurrentData(newData);
        } else {
          debugLog('Fetch returned empty data, using fallback');
          // If fetch returns null/undefined, keep current data or use initial
          if (!currentData && initialDataRef.current) {
            setCurrentData(initialDataRef.current);
          }
        }
      } catch (err) {
        debugLog('Fetch error', {
          locale,
          error: err,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
        });

        if (!isMountedRef.current) return;

        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);

        // Fallback to initial data if available
        if (initialDataRef.current) {
          debugLog('Using initial data as fallback after error');
          setCurrentData(initialDataRef.current);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [fetchFunction, router.locale, currentData, routeName]
  );

  // Handle locale changes
  useEffect(() => {
    debugLog('Locale changed effect', {
      locale: router.locale,
      isReady: router.isReady,
      pathname: router.pathname,
    });

    if (router.locale) {
      // Add delay for production routing
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          refetchData(router.locale);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [router.locale, refetchData]);

  // Initialize cache with initial data
  useEffect(() => {
    debugLog('Initialize cache effect', {
      hasInitialData: !!initialData,
      locale: router.locale,
    });

    if (initialData && router.locale) {
      cacheRef.current[router.locale] = initialData;
      setCurrentData(initialData);
    }
  }, []); // Only run once on mount

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Debug current state
  useEffect(() => {
    debugLog('State updated', {
      hasCurrentData: !!currentData,
      isLoading,
      error,
      locale: router.locale,
      dataStructure: currentData
        ? {
            type: typeof currentData,
            keys: Object.keys(currentData),
            hasPageData: !!currentData.pageData,
            hasVehicles: !!currentData.vehicles,
            vehicleCount: currentData.vehicles?.data?.length || 'N/A',
          }
        : null,
    });
  }, [currentData, isLoading, error, router.locale]);

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
    debugLog(`WithLanguageContext wrapper for ${routeName}`, {
      propsKeys: Object.keys(props),
      hasPageData: !!props.pageData,
      vehicleCount: props.vehicles?.data?.length || 'N/A',
    });

    // Determine initial data structure
    const initialData = props.pageData ? props.pageData : props;

    debugLog(`Initial data determined for ${routeName}`, {
      usePageData: !!props.pageData,
      initialData,
    });

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

// Debug helper function to get logs (call from browser console)
if (typeof window !== 'undefined') {
  (window as any).getLangContextLogs = () => {
    try {
      return JSON.parse(localStorage.getItem('langContext_debug') || '[]');
    } catch {
      return [];
    }
  };

  (window as any).clearLangContextLogs = () => {
    localStorage.removeItem('langContext_debug');
    console.log('Language context logs cleared');
  };
}
