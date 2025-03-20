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
    const [isRefetching, setIsRefetching] = useState(false);
    const [refetchTime, setRefetchTime] = useState(null);

    // Initialize state for each data key
    const [stateData, setStateData] = useState({});

    // Initialize on first render
    useEffect(() => {
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

      setStateData(initialData);
    }, []);

    // Handle locale changes
    useEffect(() => {
      // Don't refetch if router isn't ready
      if (!router.isReady) return;

      // Don't refetch if we're on the same locale as the initial props
      if (router.locale === props.locale) return;

      // Skip refetching for default locale if option is enabled
      if (options.onlyNonDefaultLocale && isDefaultLanguage) {
        if (options.debug)
          console.log(
            `[LocaleRefetch] Skipping refetch for default locale: ${options.defaultLocale}`
          );
        return;
      }

      const refetchData = async () => {
        if (options.debug) {
          console.log(
            `[LocaleRefetch] Refetching data for locale: ${router.locale}`
          );
          console.time('localeRefetch');
          setIsRefetching(true);
        }

        const startTime = performance.now();
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
              console.error('[LocaleRefetch] Error updating SEO data:', error);
            }
          }

          // Update the state with all new data
          setStateData((prevData) => ({
            ...prevData,
            ...newData,
          }));

          const endTime = performance.now();

          if (options.debug) {
            console.timeEnd('localeRefetch');
            console.log(
              `[LocaleRefetch] Refetch took ${endTime - startTime}ms`
            );
            setRefetchTime(endTime - startTime);
          }
        } catch (error) {
          console.error('[LocaleRefetch] Error fetching data:', error);
        } finally {
          if (options.debug) {
            setIsRefetching(false);
          }
        }
      };

      refetchData();
    }, [router.isReady, router.locale, props.locale, isDefaultLanguage]);

    // Create new props by combining original props with updated state data
    const updatedProps = {
      ...props,
      ...stateData,
      // Debug info
      __localeRefetch: {
        isRefetching,
        refetchTime,
        currentLocale: router.locale,
        initialLocale: props.locale,
      },
    };

    return <Component {...updatedProps} />;
  };
}
