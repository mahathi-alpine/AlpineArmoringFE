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

    // Handle locale changes and swap cached data
    useEffect(() => {
      // Don't do anything if router isn't ready
      if (!router.isReady) return;

      // If we've already fetched this locale, just swap to the cached data
      if (fetchedLocales[router.locale] && localeData[router.locale]) {
        // Update stateData with the cached data for this locale
        setStateData(localeData[router.locale]);
        return;
      }

      // Skip refetching for default locale if option is enabled
      if (options.onlyNonDefaultLocale && isDefaultLanguage) {
        return;
      }

      const refetchData = async () => {
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
        }
      };

      refetchData();
    }, [
      router.isReady,
      router.locale,
      fetchedLocales,
      localeData,
      isDefaultLanguage,
    ]);

    // Create new props by combining original props with updated state data
    const updatedProps = {
      ...props,
      ...stateData,
    };

    return <Component {...updatedProps} />;
  };
}
