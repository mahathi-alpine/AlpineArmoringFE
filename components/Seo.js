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

  // Function to remove only nxtPslug parameter
  const removeNxtPslug = (url) => {
    if (!url.includes('?')) return url;

    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    params.delete('nxtPslug');

    const cleanQuery = params.toString();
    return cleanQuery ? `${path}?${cleanQuery}` : path;
  };

  // Fix for ogUrl - remove locale from asPath if it exists and remove nxtPslug
  const cleanAsPath = removeNxtPslug(
    router.asPath.replace(/^\/[a-z]{2}(\/|$)/, '/')
  );
  const ogUrl = `${baseUrl}${normalizeUrl(cleanAsPath)}`.replace(
    /([^:])\/+/g,
    '$1/'
  );

  let canonicalUrl;
  if (seoProps?.canonicalURL) {
    canonicalUrl = isFullUrl(seoProps.canonicalURL)
      ? seoProps.canonicalURL
      : `${baseUrl}${normalizeUrl(seoProps.canonicalURL)}`;
  } else {
    // Fix for canonical URL - remove locale from asPath if it exists to avoid duplication
    // Also remove nxtPslug parameter while keeping other query params
    const pathWithoutLocale = removeNxtPslug(
      router.asPath.replace(/^\/[a-z]{2}(\/|$)/, '/')
    );
    canonicalUrl = `${baseUrl}${normalizeUrl(pathWithoutLocale)}`;
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
      <link rel="canonical" href={canonicalUrl.replace(/([^:])\/+/g, '$1/')} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Seo;
