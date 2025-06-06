import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const normalizeUrl = (url) => {
  if (!url) return '';

  // Remove the full domain if present
  let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');

  // Ensure it starts with / if not empty
  if (cleanUrl && !cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }

  // Handle root path - decide if you want trailing slash or not
  if (cleanUrl === '' || cleanUrl === '/') {
    return ''; // or return '' if you don't want trailing slash on root
  }

  return cleanUrl;
};

const isFullUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const Seo = ({ props, isDarkMode, isPadding0, isHomepage, isHeaderGray }) => {
  const router = useRouter();
  const [seoProps, setSeoProps] = useState(props);

  // Update seoProps when props change (including after locale refetch)
  useEffect(() => {
    setSeoProps(props);
  }, [props]);

  const baseUrlDefault = `https://www.alpineco.com`;
  const baseUrl = `https://www.alpineco.com${router.locale !== 'en' ? `/${router.locale}` : ''}`;
  const languageUrls = seoProps?.languageUrls || {};

  const metaTitle = seoProps?.metaTitle || 'Alpine Armoring';
  const metaDescription = seoProps?.metaDescription || 'Alpine Armoring';
  const metaImgUrl =
    seoProps?.metaImage?.data?.attributes.formats?.large?.url ||
    seoProps?.metaImage?.data?.attributes.url ||
    seoProps?.thumbnail?.formats?.large?.url ||
    seoProps?.thumbnail?.url ||
    'https://www.alpineco.com/assets/Alpine-Armoring-Armored-Vehicles.png';

  // Facebook social meta
  const facebookMeta =
    seoProps?.metaSocial?.find(
      (social) => social.socialNetwork === 'Facebook'
    ) || {};
  const facebookMetaImg =
    facebookMeta?.image?.data?.attributes.formats?.large?.url ||
    facebookMeta?.image?.data?.attributes.url ||
    metaImgUrl;

  // Twitter social meta
  const twitterMeta =
    seoProps?.metaSocial?.find(
      (social) => social.socialNetwork === 'Twitter'
    ) || {};
  const twitterMetaImg =
    twitterMeta?.image?.data?.attributes.formats?.large?.url ||
    twitterMeta?.image?.data?.attributes.url ||
    metaImgUrl;

  // Function to remove nxtP* parameters (nxtPslug, nxtPtype, etc.)
  const removeNxtParams = (url) => {
    if (!url.includes('?')) return url;

    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);

    // Remove all parameters that start with 'nxt' or 'next', and nextInternalLocale
    for (const [key] of params.entries()) {
      if (
        key.startsWith('nxt') ||
        key.startsWith('next') ||
        key === 'nextInternalLocale'
      ) {
        params.delete(key);
      }
    }

    const cleanQuery = params.toString();
    return cleanQuery ? `${path}?${cleanQuery}` : path;
  };

  // Get current query parameters (excluding nxt* params)
  const getCurrentQueryString = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      // Remove nxt* parameters and nextInternalLocale
      for (const [key] of params.entries()) {
        if (
          key.startsWith('nxt') ||
          key.startsWith('next') ||
          key === 'nextInternalLocale'
        ) {
          params.delete(key);
        }
      }

      const cleanQuery = params.toString();
      return cleanQuery ? `?${cleanQuery}` : '';
    } else {
      // Server-side: extract from router.asPath
      if (router.asPath.includes('?')) {
        const queryString = router.asPath.split('?')[1];
        const params = new URLSearchParams(queryString);

        // Remove nxt* parameters and nextInternalLocale
        for (const [key] of params.entries()) {
          if (
            key.startsWith('nxt') ||
            key.startsWith('next') ||
            key === 'nextInternalLocale'
          ) {
            params.delete(key);
          }
        }

        const cleanQuery = params.toString();
        return cleanQuery ? `?${cleanQuery}` : '';
      }
      return '';
    }
  };

  // Path without locale prefix for construction
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname + window.location.search;
      return removeNxtParams(fullPath);
    } else {
      return removeNxtParams(router.asPath);
    }
  };

  const currentPath = getCurrentPath();
  const pathForOg =
    router.locale !== 'en'
      ? currentPath.replace(new RegExp(`^/${router.locale}(/|$)`), '$1') || '/'
      : currentPath;

  const ogUrl = `${baseUrl}${normalizeUrl(pathForOg)}`.replace(
    /([^:])\/+/g,
    '$1/'
  );

  // Get query string for hreflang URLs
  const queryString = getCurrentQueryString();

  // Build hreflang URLs with query parameters
  const buildHreflangUrls = () => {
    const hreflangUrls = {};

    // Add x-default (English)
    const defaultPath = languageUrls['en'] || '/';
    const normalizedDefaultPath = normalizeUrl(defaultPath);
    hreflangUrls['x-default'] =
      normalizedDefaultPath === '/'
        ? `${baseUrlDefault}${queryString}` // No trailing slash for homepage
        : `${baseUrlDefault}${normalizedDefaultPath}${queryString}`;

    // Add all language versions
    Object.entries(languageUrls).forEach(([locale, path]) => {
      const normalizedPath = normalizeUrl(path);
      hreflangUrls[locale] =
        normalizedPath === '/'
          ? `${baseUrlDefault}${queryString}` // No trailing slash for homepage
          : `${baseUrlDefault}${normalizedPath}${queryString}`;
    });

    return hreflangUrls;
  };

  const hreflangUrls = buildHreflangUrls();

  // Canonical URL construction
  let canonicalUrl;
  if (seoProps?.canonicalURL) {
    canonicalUrl = isFullUrl(seoProps.canonicalURL)
      ? seoProps.canonicalURL
      : `${baseUrl}${normalizeUrl(seoProps.canonicalURL)}`;
  } else {
    let pathForCanonical;

    if (typeof window !== 'undefined') {
      // CLIENT SIDE: Use window.location for the actual user-facing URL
      const actualPath = window.location.pathname + window.location.search;
      const cleanPath = removeNxtParams(actualPath);

      // Remove locale prefix since baseUrl already includes it
      const pathWithoutLocale =
        router.locale !== 'en'
          ? cleanPath.replace(new RegExp(`^/${router.locale}(/|$)`), '$1') ||
            '/'
          : cleanPath;

      pathForCanonical = pathWithoutLocale;
    } else {
      // SERVER SIDE: Try to construct the correct localized path
      // router.asPath might contain the English internal path during SSR
      if (seoProps?.languageUrls && seoProps.languageUrls[router.locale]) {
        // Use the languageUrls if available, but add query params from router.asPath
        const localeUrl = seoProps.languageUrls[router.locale];
        const cleanLocaleUrl = removeNxtParams(localeUrl);

        // Remove locale prefix from languageUrls
        const pathWithoutLocale =
          router.locale !== 'en'
            ? cleanLocaleUrl.replace(
                new RegExp(`^/${router.locale}(/|$)`),
                '$1'
              ) || '/'
            : cleanLocaleUrl;

        // Add query params from router.asPath if they exist
        const queryFromAsPath = router.asPath.includes('?')
          ? '?' + router.asPath.split('?')[1]
          : '';

        // Clean the query params to remove nxtP* parameters
        const cleanQueryFromAsPath = removeNxtParams(queryFromAsPath);

        pathForCanonical = pathWithoutLocale + cleanQueryFromAsPath;
      } else {
        // Fallback to router.asPath
        const serverPath = removeNxtParams(router.asPath);
        const [pathOnly, queryOnly] = serverPath.split('?');
        pathForCanonical = queryOnly ? `${pathOnly}?${queryOnly}` : pathOnly;
      }
    }

    const normalizedPath = normalizeUrl(pathForCanonical);
    canonicalUrl =
      normalizedPath === '/'
        ? baseUrl // No trailing slash for homepage
        : `${baseUrl}${normalizedPath}`;
  }

  // Clean up any double slashes (except after protocol)
  canonicalUrl = canonicalUrl.replace(/([^:])\/+/g, '$1/');

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} key="description" />
      <meta name="image" content={metaImgUrl} />

      {isDarkMode && (
        <style>{`
          body {
            background: #101010 url(/assets/noise4.png) !important;
            background-size: 30px !important;
          }
          .navigation_submenu{
            background-color: rgba(23, 23, 23, 0.8) !important;
            backdrop-filter: blur(10px) !important;
          }
          .navigation_submenu a{
            color: white;
          }
        `}</style>
      )}

      {(isPadding0 || isHomepage) && (
        <style>{`
          body {
            padding-top: 0 !important;
          }
        `}</style>
      )}

      {isHeaderGray && (
        <style>{`
          header,
          .navigation_submenu{
            background-color: rgba(23, 23, 23, 0.8) !important;
            backdrop-filter: blur(10px) !important;
          }
          .navigation_submenu a{
            color: white;
          }
          .header_logo_gold{
            display: block !important;
          }
        `}</style>
      )}

      <link rel="author" type="text/plain" href="/humans.txt" />

      <meta
        name="google-site-verification"
        content="bCcF8Vxq5RVDB8JW0bfGQynjo9U6f5oQEwQVbobmyjE"
      />

      {/* Hreflang tags with query parameters */}
      {Object.entries(hreflangUrls).map(([hreflang, url]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={url} />
      ))}

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content={facebookMeta?.title || metaTitle}
        key="title"
      />
      <meta
        property="og:description"
        content={facebookMeta?.description || metaDescription}
      />
      {facebookMetaImg && (
        <meta property="og:image" content={facebookMetaImg} />
      )}
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterMeta?.title || metaTitle} />
      <meta
        name="twitter:description"
        content={twitterMeta?.description || metaDescription}
      />
      {twitterMetaImg && <meta name="twitter:image" content={twitterMetaImg} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} data-seo-component="true" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
      <meta name="theme-color" content="#6F6044" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default Seo;
