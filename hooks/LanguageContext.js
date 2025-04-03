import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';

// Create request cache to prevent duplicate fetches
const requestCache = new Map();

// Create context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale, events } = router;
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Update current locale state when router locale changes
  useEffect(() => {
    if (locale !== currentLocale) {
      setCurrentLocale(locale);
      // Clear cache when language changes
      requestCache.clear();
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

  // Fetch data with caching and deduplication
  const fetchLocalizedData = useCallback(async (fetcher, cacheKey) => {
    // Check if we already have this request in progress
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey);
    }

    // Start a new request and cache the promise
    setPendingRequests((prev) => prev + 1);
    const promise = fetcher().finally(() => {
      setPendingRequests((prev) => prev - 1);
    });

    requestCache.set(cacheKey, promise);

    try {
      // Await the result
      const result = await promise;

      // Keep successful results in cache briefly, but eventually remove them
      // so they can be refetched if needed
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, 30000); // Cache successful results for 30 seconds

      return result;
    } catch (error) {
      // Remove failed requests from cache immediately
      requestCache.delete(cacheKey);
      throw error;
    }
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      currentLocale,
      isChangingLanguage,
      pendingRequests: pendingRequests > 0,
      fetchLocalizedData,
    }),
    [currentLocale, isChangingLanguage, pendingRequests, fetchLocalizedData]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
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

// Custom hook to fetch localized data using the language context
export const useLocalizedData = (initialData, fetcher, dependencies = []) => {
  const { currentLocale, fetchLocalizedData } = useLanguage();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a stable cache key from the dependencies
  const cacheKey = useMemo(
    () => `${currentLocale}:${dependencies.join(',')}`,
    [currentLocale, ...dependencies]
  );

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const newData = await fetchLocalizedData(
          () => fetcher(currentLocale),
          cacheKey
        );

        if (isMounted) {
          setData(newData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching localized data:', err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, currentLocale, fetchLocalizedData, fetcher]);

  return { data, isLoading, error };
};

export default LanguageContext;
