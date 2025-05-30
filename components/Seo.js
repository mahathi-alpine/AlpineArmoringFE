import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const normalizeUrl = (url) => {
  if (!url) return '';
  console.log('🔧 normalizeUrl input:', url);
  // Remove any protocol and domain part if present
  const result = url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');
  console.log('🔧 normalizeUrl output:', result);
  return result;
};

const isFullUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const Seo = ({ props }) => {
  const router = useRouter();
  const [seoProps, setSeoProps] = useState(props);
  const [isClient, setIsClient] = useState(false);

  // Track when we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    '';

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

    // Remove all parameters that start with 'nxtP'
    for (const [key] of params.entries()) {
      if (key.startsWith('nxtP')) {
        params.delete(key);
      }
    }

    const cleanQuery = params.toString();
    return cleanQuery ? `${path}?${cleanQuery}` : path;
  };

  // Get the current URL path as seen by the user (not the rewritten internal path)
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      // On client side, use window.location.pathname + search
      const fullPath = window.location.pathname + window.location.search;
      return removeNxtParams(fullPath);
    } else {
      // On server side, construct from router
      const cleanAsPath = removeNxtParams(router.asPath);
      return cleanAsPath;
    }
  };

  const currentPath = getCurrentPath();

  // For ogUrl, we need the path without locale prefix for construction
  const pathForOg =
    router.locale !== 'en'
      ? currentPath.replace(new RegExp(`^/${router.locale}(/|$)`), '$1') || '/'
      : currentPath;

  const ogUrl = `${baseUrl}${normalizeUrl(pathForOg)}`.replace(
    /([^:])\/+/g,
    '$1/'
  );

  let canonicalUrl;
  if (seoProps?.canonicalURL) {
    canonicalUrl = isFullUrl(seoProps.canonicalURL)
      ? seoProps.canonicalURL
      : `${baseUrl}${normalizeUrl(seoProps.canonicalURL)}`;
  } else {
    let pathForCanonical;

    console.log('🔧 DEBUG: Starting canonical URL construction');
    console.log(
      '🔧 DEBUG: isClient:',
      isClient,
      'hasWindow:',
      typeof window !== 'undefined'
    );

    if (typeof window !== 'undefined') {
      // CLIENT SIDE: Use the actual URL path from window.location
      const actualPath = window.location.pathname + window.location.search;
      const cleanPath = removeNxtParams(actualPath);

      console.log('🔧 CLIENT DEBUG:');
      console.log('  actualPath:', actualPath);
      console.log('  cleanPath after removeNxtParams:', cleanPath);

      // Split path and query to handle them separately
      const [pathOnly, queryOnly] = cleanPath.split('?');
      console.log('  pathOnly:', pathOnly);
      console.log('  queryOnly:', queryOnly);

      // Remove locale prefix from path only
      let cleanPathOnly =
        router.locale !== 'en'
          ? pathOnly.replace(new RegExp(`^/${router.locale}(/|$)`), '$1')
          : pathOnly;

      console.log('  cleanPathOnly after locale removal:', cleanPathOnly);

      // Ensure we have at least '/' if the path becomes empty
      if (!cleanPathOnly || cleanPathOnly === '') {
        cleanPathOnly = '/';
      }

      // Reconstruct with query parameters
      pathForCanonical = queryOnly
        ? `${cleanPathOnly}?${queryOnly}`
        : cleanPathOnly;
      console.log('  pathForCanonical final:', pathForCanonical);
    } else {
      // SERVER SIDE or initial render
      console.log('🔧 SERVER DEBUG:');
      console.log('  router.asPath:', router.asPath);
      console.log('  seoProps.languageUrls:', seoProps?.languageUrls);

      // Prefer router.asPath since it contains query parameters
      // languageUrls from getServerSideProps doesn't include dynamic query params
      const serverPath = removeNxtParams(router.asPath);
      console.log('  serverPath after removeNxtParams:', serverPath);

      // Split path and query to handle them separately
      const [pathOnly, queryOnly] = serverPath.split('?');
      console.log('  pathOnly:', pathOnly);
      console.log('  queryOnly:', queryOnly);

      // router.asPath on server doesn't include locale prefix, so use as-is
      pathForCanonical = queryOnly ? `${pathOnly}?${queryOnly}` : pathOnly;
      console.log('  pathForCanonical from router.asPath:', pathForCanonical);
    }

    console.log(
      '🔧 DEBUG: Before normalizeUrl - pathForCanonical:',
      pathForCanonical
    );
    console.log('🔧 DEBUG: baseUrl:', baseUrl);
    console.log(
      '🔧 DEBUG: normalizeUrl(pathForCanonical):',
      normalizeUrl(pathForCanonical)
    );

    canonicalUrl = `${baseUrl}${normalizeUrl(pathForCanonical)}`;
    console.log('🔧 DEBUG: After construction - canonicalUrl:', canonicalUrl);

    // Add timestamp to track different renders
    console.log('🔧 DEBUG: Render timestamp:', Date.now());
    console.log(
      '🔧 DEBUG: Component render environment:',
      typeof window !== 'undefined' ? 'CLIENT' : 'SERVER'
    );
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

      {/* Hreflang tags */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrlDefault}${normalizeUrl(languageUrls['en'] || '/')}`}
      />
      {Object.entries(languageUrls).map(([locale, path]) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrlDefault}${normalizeUrl(path)}`}
        />
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
      <link rel="canonical" href={canonicalUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Seo;
