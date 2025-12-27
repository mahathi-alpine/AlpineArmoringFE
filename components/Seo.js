import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const sanitizeUrl = (url) => {
  if (!url) return '';

  // Remove any duplicate domain patterns
  const cleanUrl = url
    // Remove duplicate alpineco.com patterns
    .replace(/\/www\.alpineco\.com\/www\.alpineco\.com/gi, '')
    .replace(/\/alpineco\.com\/alpineco\.com/gi, '')
    .replace(/\/www\.alpineco\.com\/alpineco\.com/gi, '')
    .replace(/\/alpineco\.com\/www\.alpineco\.com/gi, '')
    // Remove standalone domain prefixes in paths
    .replace(/^\/www\.alpineco\.com/, '')
    .replace(/^\/alpineco\.com/, '')
    // Clean up multiple slashes
    .replace(/\/+/g, '/')
    // Ensure starts with slash if not empty
    .replace(/^(?!\/)(.+)/, '/$1');

  return cleanUrl;
};

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

const Seo = ({
  props,
  isDarkMode,
  isPadding0,
  isHomepage,
  isHeaderGray,
  isBlog,
}) => {
  const router = useRouter();
  const [seoProps, setSeoProps] = useState(props);

  // Update seoProps when props change (including after locale refetch)
  useEffect(() => {
    setSeoProps(props);
  }, [props]);

  const hasNoIndexParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (
        params.has('vehicles_we_armor') ||
        params.has('vehiculos_que_blindamos') ||
        params.has('source')
      );
    } else {
      // Server-side: check router.query first, then fallback to parsing asPath
      const { vehicles_we_armor, vehiculos_que_blindamos, source } =
        router.query;
      let hasParams = !!(
        vehicles_we_armor ||
        vehiculos_que_blindamos ||
        source
      );

      // Fallback: parse from asPath if query is empty
      if (!hasParams && router.asPath.includes('?')) {
        const urlParams = new URLSearchParams(router.asPath.split('?')[1]);
        hasParams =
          urlParams.has('vehicles_we_armor') ||
          urlParams.has('vehiculos_que_blindamos') ||
          urlParams.has('source');
      }

      return hasParams;
    }
  };

  const shouldNoIndex = hasNoIndexParams();

  const baseUrlDefault = process.env.NEXT_PUBLIC_URL;
  const baseUrl = `${baseUrlDefault}${router.locale !== 'en' ? `/${router.locale}` : ''}`;

  const metaTitle = seoProps?.metaTitle || 'Alpine Armoring';
  const metaDescription = seoProps?.metaDescription || 'Alpine Armoring';
  const metaRobots = seoProps?.metaRobots || null;
  const metaImgUrl =
    seoProps?.metaImage?.data?.attributes.formats?.large?.url ||
    seoProps?.metaImage?.data?.attributes.url ||
    seoProps?.thumbnail?.formats?.large?.url ||
    seoProps?.thumbnail?.url ||
    `${baseUrlDefault}/assets/Alpine-Logo.png`;

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

  const keepOnlyAllowedParams = (url) => {
    if (!url.includes('?')) return url;

    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    const allowedParams = new URLSearchParams();

    if (params.has('make')) {
      allowedParams.set('make', params.get('make'));
    }

    const cleanQuery = allowedParams.toString();
    return cleanQuery ? `${path}?${cleanQuery}` : path;
  };

  const getCurrentQueryString = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const allowedParams = new URLSearchParams();

      if (params.has('make')) {
        allowedParams.set('make', params.get('make'));
      }

      const cleanQuery = allowedParams.toString();
      return cleanQuery ? `?${cleanQuery}` : '';
    } else {
      // Server-side: extract from router.asPath
      if (router.asPath.includes('?')) {
        const queryString = router.asPath.split('?')[1];
        const params = new URLSearchParams(queryString);
        const allowedParams = new URLSearchParams();

        if (params.has('make')) {
          allowedParams.set('make', params.get('make'));
        }

        const cleanQuery = allowedParams.toString();
        return cleanQuery ? `?${cleanQuery}` : '';
      }
      return '';
    }
  };

  // Path without locale prefix for construction
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname + window.location.search;
      return keepOnlyAllowedParams(fullPath);
    } else {
      return keepOnlyAllowedParams(router.asPath);
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

  const buildHreflangUrls = () => {
    // Don't build hreflang URLs if page should be noindex
    if (shouldNoIndex) {
      return {};
    }
    // Check if languageUrls is explicitly set to false
    if (seoProps?.languageUrls === false) {
      return {};
    }

    const hreflangUrls = {};
    const languageUrlsToUse = seoProps?.languageUrls || {};

    const defaultPath = sanitizeUrl(languageUrlsToUse['en'] || '/');
    const normalizedDefaultPath = normalizeUrl(defaultPath);
    hreflangUrls['x-default'] =
      normalizedDefaultPath === '/'
        ? `${baseUrlDefault}${queryString}`
        : `${baseUrlDefault}${normalizedDefaultPath}${queryString}`;

    Object.entries(languageUrlsToUse).forEach(([locale, path]) => {
      const sanitizedPath = sanitizeUrl(path);
      const normalizedPath = normalizeUrl(sanitizedPath);
      hreflangUrls[locale] =
        normalizedPath === '/'
          ? `${baseUrlDefault}${queryString}`
          : `${baseUrlDefault}${normalizedPath}${queryString}`;
    });

    return hreflangUrls;
  };

  const hreflangUrls = buildHreflangUrls();

  let canonicalUrl;
  let shouldRenderCanonical = !shouldNoIndex; // Don't render canonical if noindex

  // Check if canonicalURL is explicitly set to false
  if (seoProps?.canonicalURL === false || shouldNoIndex) {
    shouldRenderCanonical = false;
  } else if (seoProps?.canonicalURL) {
    const cleanCanonical = sanitizeUrl(seoProps.canonicalURL);
    canonicalUrl = isFullUrl(seoProps.canonicalURL)
      ? seoProps.canonicalURL
      : `${baseUrl}${normalizeUrl(cleanCanonical)}`;
  } else {
    let pathForCanonical;

    if (typeof window !== 'undefined') {
      const actualPath = window.location.pathname + window.location.search;
      const cleanPath = keepOnlyAllowedParams(actualPath);

      // Sanitize the path to remove any domain duplications
      const sanitizedPath = sanitizeUrl(cleanPath);

      const pathWithoutLocale =
        router.locale !== 'en'
          ? sanitizedPath.replace(
              new RegExp(`^/${router.locale}(/|$)`),
              '$1'
            ) || '/'
          : sanitizedPath;

      pathForCanonical = pathWithoutLocale;
    } else {
      if (seoProps?.languageUrls && seoProps.languageUrls[router.locale]) {
        const localeUrl = seoProps.languageUrls[router.locale];
        const cleanLocaleUrl = keepOnlyAllowedParams(localeUrl);

        // Sanitize the locale URL
        const sanitizedLocaleUrl = sanitizeUrl(cleanLocaleUrl);

        const pathWithoutLocale =
          router.locale !== 'en'
            ? sanitizedLocaleUrl.replace(
                new RegExp(`^/${router.locale}(/|$)`),
                '$1'
              ) || '/'
            : sanitizedLocaleUrl;

        const queryFromAsPath = router.asPath.includes('?')
          ? '?' + router.asPath.split('?')[1]
          : '';

        const cleanQueryFromAsPath = keepOnlyAllowedParams(queryFromAsPath);

        pathForCanonical = pathWithoutLocale + cleanQueryFromAsPath;
      } else {
        const serverPath = keepOnlyAllowedParams(router.asPath);
        const sanitizedServerPath = sanitizeUrl(serverPath);
        const [pathOnly, queryOnly] = sanitizedServerPath.split('?');
        pathForCanonical = queryOnly ? `${pathOnly}?${queryOnly}` : pathOnly;
      }
    }

    const normalizedPath = normalizeUrl(pathForCanonical);
    canonicalUrl =
      normalizedPath === '/' ? baseUrl : `${baseUrl}${normalizedPath}`;
  }

  // Clean up any double slashes (except after protocol)
  if (canonicalUrl) {
    canonicalUrl = canonicalUrl.replace(/([^:])\/+/g, '$1/');
  }

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} key="description" />
      <meta name="image" content={metaImgUrl} />

      {/* Meta Robots tag */}
      {shouldNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        metaRobots && <meta name="robots" content={metaRobots} />
      )}

      {isBlog && (
        <style>{`
          @media (min-width: 768px){
            body{
              overflow-x: hidden;
            
              &:before {
                position: absolute;
                content: '';
                left: 0;
                right: 0;
                top: 0;
                background: var(--color-white);
                height: 550px;
              }
              &:after {
                position: absolute;
                content: '';
                left: 0;
                right: 0;
                top: 550px;
                background: var(--color-white);
                height: 100px;
                left: -100px;
                right: -100px;
                border-radius: 50%/0 0 100% 100%;
                z-index: -1;
              }
            }   
            #header_burger:before{
              background: white;
            }
            .b-header #header_burger:hover:before{
              background: black;
            }       
            .b-header #header_burger:hover > div,
            .b-header #header_burger:hover > div:before,
            .b-header #header_burger:hover > div:after{
              background: white;
            }  
          }
        `}</style>
      )}

      {isDarkMode && (
        <style>{`
          body {
            background: #101010 url(/assets/noise4.png) !important;
            background-size: 30px !important;
          }
          .static a,
          .b-breadcrumbs{
            color: var(--color-primaryLight) !important;
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

      {/* Hreflang tags - only render if not noindex and languageUrls is not false */}
      {!shouldNoIndex &&
        seoProps?.languageUrls !== false &&
        Object.entries(hreflangUrls).map(([hreflang, url]) => (
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

      {/* Canonical URL - only render if not noindex and not explicitly set to false */}
      {shouldRenderCanonical && canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
      <meta name="theme-color" content="#6F6044" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/manifest.json" />

      {(router.pathname === '/' || router.pathname === '/es') && (
        <>
          <meta
            property="og:video"
            content="https://assets.alpineco.com/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4"
          />
          <meta
            property="og:video:secure_url"
            content="https://assets.alpineco.com/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4"
          />
          <meta property="og:video:type" content="video/mp4" />
          <meta property="og:video:width" content="1920" />
          <meta property="og:video:height" content="1080" />

          {/* Twitter video tags */}
          <meta name="twitter:card" content="player" />
          <meta
            name="twitter:player"
            content="https://assets.alpineco.com/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4"
          />
          <meta name="twitter:player:width" content="1920" />
          <meta name="twitter:player:height" content="1080" />

          {/* <link 
            rel="preload" 
            href="https://assets.alpineco.com/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4" 
            as="video" 
            type="video/mp4"
          /> */}
        </>
      )}

      <link rel="preconnect" href="https://assets.alpineco.com" />
      <link rel="dns-prefetch" href="https://assets.alpineco.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
    </Head>
  );
};

export default Seo;
