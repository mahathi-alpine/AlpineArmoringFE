import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import routes from 'routes';

/**
 * Enhanced HOC for locale-aware refetching with support for multiple data sources
 * @param {Component} Component - The component to wrap
 * @param {Object|Function} fetchConfig - Either a function to fetch data or a config object with multiple fetchers
 * @param {Object} options - Configuration options
 * @returns {Component} Wrapped component with locale refetch capability
 */
export default function withLocaleRefetch(
  Component,
  fetchConfig,
  options = {
    defaultLocale: 'en',
    debug: false,
    onlyNonDefaultLocale: true,
    includeSeo: true,
    routeName: null,
  }
) {
  return function WrappedComponent(props) {
    const router = useRouter();
    const isDefaultLanguage = router.locale === options.defaultLocale;
    const [fetchedLocales, setFetchedLocales] = useState(() => {
      // Initialize with the props locale
      const locales = {};
      if (props.locale) {
        locales[props.locale] = true;
      }
      return locales;
    });

    // Store cached data for each locale
    const [localeData, setLocaleData] = useState(() => {
      // Initialize with the props locale data
      const data = {};
      if (props.locale) {
        // Create initial entry for pageData and any other keys
        const initialEntry = {};

        if (typeof fetchConfig === 'function') {
          // For single data source
          initialEntry['pageData'] = props['pageData'];

          // Include SEO data if enabled
          if (options.includeSeo) {
            initialEntry['seoData'] = props.seoData;
          }
        } else if (typeof fetchConfig === 'object') {
          // For multiple data sources
          Object.keys(fetchConfig).forEach((key) => {
            initialEntry[key] = props[key];
          });

          // Include SEO data if enabled
          if (options.includeSeo) {
            initialEntry['seoData'] = props.seoData;
          }
        }

        data[props.locale] = initialEntry;
      }
      return data;
    });

    // Initialize state for each data key
    const [stateData, setStateData] = useState(() => {
      const initialData = {};

      // If fetchConfig is a function, we're handling a single data source
      if (typeof fetchConfig === 'function') {
        // Use 'pageData' as the default key
        initialData['pageData'] = props['pageData'];
      }
      // If it's an object, we're handling multiple data sources
      else if (typeof fetchConfig === 'object') {
        // Initialize each data key from props
        Object.keys(fetchConfig).forEach((key) => {
          initialData[key] = props[key];
        });
      }

      // Include SEO data if enabled
      if (options.includeSeo) {
        initialData['seoData'] = props.seoData;
      }

      return initialData;
    });

    // Add loading state to prevent rendering with undefined data
    const [isLoading, setIsLoading] = useState(false);

    // Handle locale changes and swap cached data
    useEffect(() => {
      console.log('[LocaleRefetch] useEffect triggered:', {
        'router.isReady': router.isReady,
        'router.locale': router.locale,
        isDefaultLanguage: isDefaultLanguage,
        'fetchedLocales[router.locale]': fetchedLocales[router.locale],
        'has localeData': !!localeData[router.locale],
        'options.onlyNonDefaultLocale': options.onlyNonDefaultLocale,
      });

      // Don't do anything if router isn't ready
      if (!router.isReady) {
        console.log('[LocaleRefetch] Router not ready, returning');
        return;
      }

      // If we've already fetched this locale, just swap to the cached data
      if (fetchedLocales[router.locale] && localeData[router.locale]) {
        console.log(
          '[LocaleRefetch] Using cached data for locale:',
          router.locale
        );
        // Update stateData with the cached data for this locale
        setStateData(localeData[router.locale]);
        return;
      }

      // Skip refetching for default locale if option is enabled
      if (options.onlyNonDefaultLocale && isDefaultLanguage) {
        console.log('[LocaleRefetch] Skipping refetch for default locale');
        return;
      }

      // For non-default locales, always refetch if we don't have data
      const shouldRefetch = !isDefaultLanguage || !options.onlyNonDefaultLocale;

      if (shouldRefetch) {
        console.log(
          '[LocaleRefetch] Should refetch data for locale:',
          router.locale
        );
      } else {
        console.log(
          '[LocaleRefetch] Skipping refetch for locale:',
          router.locale
        );
        return;
      }

      // Only refetch if we don't have data for this locale
      if (!fetchedLocales[router.locale]) {
        const refetchData = async () => {
          setIsLoading(true);
          const newData = {};

          try {
            // Handle single data source
            if (typeof fetchConfig === 'function') {
              newData['pageData'] = await fetchConfig(router.locale);
            }
            // Handle multiple data sources
            else if (typeof fetchConfig === 'object') {
              for (const [key, fetcher] of Object.entries(fetchConfig)) {
                newData[key] = await fetcher(router.locale);
              }
            }

            // Update SEO data if enabled
            if (options.includeSeo && options.routeName) {
              try {
                const route = routes[options.routeName];
                if (route) {
                  const pageData = newData['pageData'] || stateData['pageData'];
                  newData['seoData'] = {
                    ...(pageData?.seo || {}),
                    languageUrls: route.getIndexLanguageUrls(router.locale),
                  };
                }
              } catch (error) {
                console.error(
                  '[LocaleRefetch] Error updating SEO data:',
                  error
                );
              }
            }

            // Update the state with new data
            setStateData(newData);

            // Cache the data for this locale
            setLocaleData((prev) => ({
              ...prev,
              [router.locale]: newData,
            }));

            // Update tracking of which locales we've fetched
            setFetchedLocales((prev) => ({
              ...prev,
              [router.locale]: true,
            }));
          } catch (error) {
            console.error('[LocaleRefetch] Error fetching data:', error);
            // On error, keep the existing state data to prevent crashes
          } finally {
            setIsLoading(false);
          }
        };

        refetchData();
      }
    }, [
      router.isReady,
      router.locale,
      fetchedLocales,
      localeData,
      isDefaultLanguage,
    ]);

    // Debug logging
    if (options.debug) {
      console.log('[LocaleRefetch DEBUG] Current state:', {
        locale: router.locale,
        isDefaultLanguage,
        isLoading,
        fetchedLocales,
        hasStateData: !!stateData,
        stateDataKeys: Object.keys(stateData),
        stateDataPageData: !!stateData.pageData,
        stateDataVehicles: !!stateData.vehicles,
        stateDataVehiclesData: !!stateData.vehicles?.data,
      });
    }

    // Only apply loading checks for non-default locales or when explicitly loading
    const shouldShowLoading =
      !isDefaultLanguage && isLoading && !fetchedLocales[router.locale];

    if (shouldShowLoading) {
      console.log('[LocaleRefetch] Showing loading for non-default locale');
      return <div>Loading...</div>; // Or your preferred loading component
    }

    // For non-default locales, ensure we have some data before rendering
    // Only check if we should have data (i.e., we're fetching or should have fetched)
    if (!isDefaultLanguage && !fetchedLocales[router.locale] && isLoading) {
      console.log('[LocaleRefetch] Still loading data for non-default locale');
      return <div>Loading...</div>; // Or your preferred loading component
    }

    // Create new props by combining original props with updated state data
    const updatedProps = {
      ...props,
      ...stateData,
    };

    return <Component {...updatedProps} />;
  };
}
