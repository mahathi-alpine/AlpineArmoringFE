import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Seo = () => {
  const router = useRouter();

  const forceDisableCanonical = !!(
    router.asPath.includes('vehicles_we_armor=') ||
    router.asPath.includes('vehiculos_que_blindamos=') ||
    router.asPath.includes('source=')
  );

  const baseUrl = `https://www.alpineco.com${router.locale !== 'en' ? `/${router.locale}` : ''}`;

  let shouldRenderCanonical = !forceDisableCanonical;
  console.log(shouldRenderCanonical);
  // return null;

  const canonicalUrl = `${baseUrl}`;

  return (
    <Head>
      {shouldRenderCanonical && (
        <link rel="canonical" href={canonicalUrl} data-seo-component="true" />
      )}
    </Head>
  );
};

export default Seo;
