import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const normalizeUrl = (url) => {
  if (!url) return '';
  return url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');
};

const isFullUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const Seo = ({ props }) => {
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

    canonicalUrl = `${baseUrl}${normalizeUrl(pathForCanonical)}`;
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
