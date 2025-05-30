import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove any protocol and domain part if present
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

  // DEBUG: Log debugging information to console (remove after fixing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.group('🔍 SEO Debug Information');
      console.log('router.locale:', router.locale);
      console.log('router.asPath:', router.asPath);
      console.log('window.location.pathname:', window.location.pathname);
      console.log('window.location.search:', window.location.search);
      console.log('window.location.href:', window.location.href);
      console.log('currentPath (calculated):', currentPath);
      console.log('baseUrl:', baseUrl);
      console.groupEnd();
    }
  }, [router.asPath, router.locale, currentPath, baseUrl]);

  // For ogUrl, we need the path without locale prefix for construction
  const pathForOg =
    router.locale !== 'en'
      ? currentPath.replace(new RegExp(`^/${router.locale}`), '') || '/'
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
    // Since currentPath includes the locale and baseUrl also includes the locale,
    // we need to use the path without locale for construction
    let pathForCanonical;

    if (typeof window !== 'undefined') {
      // On client side, use window.location.pathname and remove locale prefix
      const fullPath = window.location.pathname + window.location.search;
      const cleanPath = removeNxtParams(fullPath);

      // DEBUG: Log path construction steps
      console.log('🔧 Path construction steps:');
      console.log('  fullPath:', fullPath);
      console.log('  cleanPath after removeNxtParams:', cleanPath);

      pathForCanonical =
        router.locale !== 'en'
          ? cleanPath.replace(new RegExp(`^/${router.locale}`), '') || '/'
          : cleanPath;

      console.log('  pathForCanonical after locale removal:', pathForCanonical);
    } else {
      // On server side, router.asPath doesn't include locale prefix
      pathForCanonical = removeNxtParams(router.asPath);
      console.log('🔧 Server side pathForCanonical:', pathForCanonical);
    }

    canonicalUrl = `${baseUrl}${normalizeUrl(pathForCanonical)}`;
    console.log('🔧 Final canonicalUrl construction:', canonicalUrl);
  }

  // DEBUG: Log final canonical URL (remove after fixing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔗 Final canonical URL:', canonicalUrl);
    }
  }, [canonicalUrl]);

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
      <link rel="canonical" href={canonicalUrl.replace(/([^:])\/+/g, '$1/')} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Seo;
