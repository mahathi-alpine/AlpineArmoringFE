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

    console.log('=== HOC WRAPPER DEBUG START ===');
    console.log(
      'HOC: Component mounting/rendering with locale:',
      router.locale
    );
    console.log('HOC: Is default language?', isDefaultLanguage);
    console.log('HOC: Router ready?', router.isReady);
    console.log('HOC: Incoming props keys:', Object.keys(props));
    console.log('HOC: Props.vehicles exists?', !!props.vehicles);
    console.log('HOC: Props.vehicles.data exists?', !!props.vehicles?.data);
    console.log('HOC: Props.pageData exists?', !!props.pageData);
    console.log('=== HOC WRAPPER DEBUG END ===');
    const [fetchedLocales, setFetchedLocales] = useState(() => {
      // Initialize with the props locale
      const locales = {};
      if (props.locale) {
        locales[props.locale] = true;
        console.log(
          'HOC: Initializing fetchedLocales with locale:',
          props.locale
        );
      }
      console.log('HOC: Initial fetchedLocales:', locales);
      return locales;
    });

    // Store cached data for each locale
    const [localeData, setLocaleData] = useState(() => {
      console.log('HOC: Initializing localeData...');
      // Initialize with the props locale data
      const data = {};
      if (props.locale) {
        console.log('HOC: Setting up initial locale data for:', props.locale);
        // Create initial entry for pageData and any other keys
        const initialEntry = {};

        if (typeof fetchConfig === 'function') {
          // For single data source
          initialEntry['pageData'] = props['pageData'];
          console.log(
            'HOC: Single data source - pageData set:',
            !!props['pageData']
          );

          // Include SEO data if enabled
          if (options.includeSeo) {
            initialEntry['seoData'] = props.seoData;
            console.log('HOC: SEO data included:', !!props.seoData);
          }
        } else if (typeof fetchConfig === 'object') {
          console.log(
            'HOC: Multiple data sources - keys:',
            Object.keys(fetchConfig)
          );
          // For multiple data sources
          Object.keys(fetchConfig).forEach((key) => {
            initialEntry[key] = props[key];
            console.log(`HOC: Setting ${key}:`, !!props[key]);
          });

          // Include SEO data if enabled
          if (options.includeSeo) {
            initialEntry['seoData'] = props.seoData;
            console.log('HOC: SEO data included:', !!props.seoData);
          }
        }

        data[props.locale] = initialEntry;
        console.log(
          'HOC: Initial locale data structure:',
          Object.keys(initialEntry)
        );
      }
      console.log('HOC: Completed localeData initialization');
      return data;
    });

    // Initialize state for each data key - ALWAYS start with props data
    const [stateData, setStateData] = useState(() => {
      console.log('HOC: Initializing stateData...');
      const initialData = {};

      // If fetchConfig is a function, we're handling a single data source
      if (typeof fetchConfig === 'function') {
        // Use 'pageData' as the default key
        initialData['pageData'] = props['pageData'];
        console.log(
          'HOC: StateData single source - pageData:',
          !!props['pageData']
        );
      }
      // If it's an object, we're handling multiple data sources
      else if (typeof fetchConfig === 'object') {
        console.log(
          'HOC: StateData multiple sources - keys:',
          Object.keys(fetchConfig)
        );
        // Initialize each data key from props
        Object.keys(fetchConfig).forEach((key) => {
          initialData[key] = props[key];
          console.log(`HOC: StateData ${key}:`, !!props[key]);
          if (key === 'vehicles' && props[key]) {
            console.log(`HOC: StateData vehicles.data:`, !!props[key]?.data);
            console.log(
              `HOC: StateData vehicles.data length:`,
              props[key]?.data?.length
            );
          }
        });
      }

      // Include SEO data if enabled
      if (options.includeSeo) {
        initialData['seoData'] = props.seoData;
        console.log('HOC: StateData SEO included:', !!props.seoData);
      }

      console.log(
        'HOC: StateData initialization complete. Keys:',
        Object.keys(initialData)
      );
      return initialData;
    });

    // Handle locale changes and swap cached data
    useEffect(() => {
      console.log('=== HOC LOCALE CHANGE EFFECT START ===');
      console.log('HOC: Effect triggered - router.locale:', router.locale);
      console.log('HOC: Router ready?', router.isReady);
      console.log('HOC: Is default language?', isDefaultLanguage);
      console.log('HOC: fetchedLocales:', fetchedLocales);
      console.log(
        'HOC: Has cached data for locale?',
        !!localeData[router.locale]
      );

      // Don't do anything if router isn't ready
      if (!router.isReady) {
        console.log('HOC: Router not ready, skipping');
        return;
      }

      // If we've already fetched this locale, just swap to the cached data
      if (fetchedLocales[router.locale] && localeData[router.locale]) {
        console.log('HOC: Using cached data for locale:', router.locale);
        console.log(
          'HOC: Cached data keys:',
          Object.keys(localeData[router.locale])
        );
        // Update stateData with the cached data for this locale
        setStateData(localeData[router.locale]);
        console.log('HOC: Swapped to cached data');
        return;
      }

      // Skip refetching for default locale if option is enabled
      if (options.onlyNonDefaultLocale && isDefaultLanguage) {
        console.log('HOC: Skipping refetch for default locale');
        return;
      }

      console.log('HOC: Need to fetch data for locale:', router.locale);
      // For non-default locales that haven't been fetched yet,
      // we need to fetch the data
      const refetchData = async () => {
        console.log('HOC: Starting data refetch...');
        const newData = {};

        try {
          // Handle single data source
          if (typeof fetchConfig === 'function') {
            console.log('HOC: Fetching single data source...');
            newData['pageData'] = await fetchConfig(router.locale);
            console.log(
              'HOC: Single data source result:',
              !!newData['pageData']
            );
          }
          // Handle multiple data sources
          else if (typeof fetchConfig === 'object') {
            console.log('HOC: Fetching multiple data sources...');
            for (const [key, fetcher] of Object.entries(fetchConfig)) {
              console.log(`HOC: Fetching ${key}...`);
              newData[key] = await fetcher(router.locale);
              console.log(`HOC: ${key} result:`, !!newData[key]);
              if (key === 'vehicles' && newData[key]) {
                console.log(`HOC: ${key}.data:`, !!newData[key]?.data);
                console.log(
                  `HOC: ${key}.data length:`,
                  newData[key]?.data?.length
                );
              }
            }
          }

          // Update SEO data if enabled
          if (options.includeSeo && options.routeName) {
            try {
              console.log('HOC: Updating SEO data...');
              const route = routes[options.routeName];
              if (route) {
                const pageData = newData['pageData'] || stateData['pageData'];
                newData['seoData'] = {
                  ...(pageData?.seo || {}),
                  languageUrls: route.getIndexLanguageUrls(router.locale),
                };
                console.log('HOC: SEO data updated');
              }
            } catch (error) {
              console.error('[LocaleRefetch] Error updating SEO data:', error);
            }
          }

          console.log(
            'HOC: Setting new state data with keys:',
            Object.keys(newData)
          );
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

          console.log('HOC: Data refetch completed successfully');
        } catch (error) {
          console.error('[LocaleRefetch] Error fetching data:', error);
          // On error, fall back to using the original props
          // This prevents the component from breaking when API calls fail
          console.log('HOC: Falling back to original props due to error');
          const fallbackData = {};
          if (typeof fetchConfig === 'function') {
            fallbackData['pageData'] = props['pageData'];
          } else if (typeof fetchConfig === 'object') {
            Object.keys(fetchConfig).forEach((key) => {
              fallbackData[key] = props[key];
              console.log(`HOC: Fallback ${key}:`, !!props[key]);
            });
          }
          if (options.includeSeo) {
            fallbackData['seoData'] = props.seoData;
          }
          console.log(
            'HOC: Setting fallback data with keys:',
            Object.keys(fallbackData)
          );
          setStateData(fallbackData);
        }
      };

      refetchData();
      console.log('=== HOC LOCALE CHANGE EFFECT END ===');
    }, [
      router.isReady,
      router.locale,
      fetchedLocales,
      localeData,
      isDefaultLanguage,
    ]);

    // Create new props by combining original props with updated state data
    // Make sure we always have valid data by using props as fallback
    const updatedProps = {
      ...props,
      ...stateData,
    };

    // Ensure critical data structures exist to prevent undefined errors
    if (typeof fetchConfig === 'object') {
      Object.keys(fetchConfig).forEach((key) => {
        if (!updatedProps[key]) {
          updatedProps[key] = props[key];
        }
      });
    }

    return <Component {...updatedProps} />;
  };
}
