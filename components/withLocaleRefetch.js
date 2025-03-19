import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import routes from 'routes';

/**
 * Enhanced HOC for locale-aware refetching with SEO support
 * @param {Component} Component - The component to wrap
 * @param {Function} fetchDataFn - Function to fetch new data based on locale
 * @param {string} dataKey - The prop name that holds the data (default: 'pageData')
 * @param {Object} options - Configuration options
 * @returns {Component} Wrapped component with locale refetch capability
 */
export default function withLocaleRefetch(
  Component,
  fetchDataFn,
  dataKey = 'pageData',
  options = {
    defaultLocale: 'en',
    debug: false,
    onlyNonDefaultLocale: true,
    includeSeo: true, // Whether to update SEO data
    routeName: null, // Route name (needed for SEO updates)
  }
) {
  return function WrappedComponent(props) {
    const router = useRouter();
    const [data, setData] = useState(props[dataKey]);
    const [seoData, setSeoData] = useState(props.seoData);
    const [isRefetching, setIsRefetching] = useState(false);
    const [refetchTime, setRefetchTime] = useState(null);

    useEffect(() => {
      // Don't refetch if router isn't ready
      if (!router.isReady) return;

      // Don't refetch if we're on the same locale as the initial props
      if (router.locale === props.locale) return;

      // Skip refetching for default locale if option is enabled
      if (
        options.onlyNonDefaultLocale &&
        router.locale === options.defaultLocale
      ) {
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
        const newData = await fetchDataFn(router.locale);
        const endTime = performance.now();

        // Update SEO data if enabled
        if (options.includeSeo && options.routeName) {
          try {
            const route = routes[options.routeName];
            if (route) {
              const newSeoData = {
                ...(newData?.seo || {}),
                languageUrls: route.getIndexLanguageUrls(router.locale),
              };
              setSeoData(newSeoData);
            }
          } catch (error) {
            console.error('[LocaleRefetch] Error updating SEO data:', error);
          }
        }

        if (options.debug) {
          console.timeEnd('localeRefetch');
          console.log(`[LocaleRefetch] Refetch took ${endTime - startTime}ms`);
          setRefetchTime(endTime - startTime);
          setIsRefetching(false);
        }

        setData(newData);
      };

      refetchData();
    }, [router.isReady, router.locale, props.locale]);

    // Create new props with the updated data
    const updatedProps = {
      ...props,
      [dataKey]: data,
      seoData: seoData,
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
