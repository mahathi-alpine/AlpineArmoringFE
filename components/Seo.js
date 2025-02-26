import { React } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Seo = ({ props }) => {
  const router = useRouter();
  const baseUrl = `https://www.alpineco.com${router.locale !== 'en' ? `/${router.locale}` : ''}`;
  // const languageUrls = props?.languageUrls || {};
  // Default values
  const metaTitle = props?.metaTitle || 'Alpine Armoring';
  const metaDescription = props?.metaDescription || 'Alpine Armoring';
  const metaImgUrl =
    props?.metaImage?.data?.attributes.formats?.large?.url ||
    props?.metaImage?.data?.attributes.url ||
    props?.thumbnail?.formats?.large?.url ||
    props?.thumbnail?.url ||
    '';

  // Faceook social meta
  const facebookMeta =
    props?.metaSocial?.find((social) => social.socialNetwork === 'Facebook') ||
    {};
  const facebookMetaImg =
    facebookMeta?.image?.data?.attributes.formats?.large?.url ||
    facebookMeta?.image?.data?.attributes.url ||
    metaImgUrl;

  // Twitter social meta
  const twitterMeta =
    props?.metaSocial?.find((social) => social.socialNetwork === 'Twitter') ||
    {};
  const twitterMetaImg =
    twitterMeta?.image?.data?.attributes.formats?.large?.url ||
    twitterMeta?.image?.data?.attributes.url ||
    metaImgUrl;

  // Construct full URLs
  const canonicalUrl = props?.canonicalURL || `${baseUrl}${router.asPath}`;
  const ogUrl = `${baseUrl}${router.asPath}`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} key="description" />
      <meta name="image" content={metaImgUrl} />

      {/* Hreflang tags */}
      {/* <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${languageUrls['en'] || '/'}`}
      />
      {Object.entries(languageUrls).map(([locale, path]) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}${path}`}
        />
      ))} */}

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

      {/* Additional Recommended Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  );
};

export default Seo;
