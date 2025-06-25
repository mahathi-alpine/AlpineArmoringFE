import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Seo = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Only run after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server-side for query param pages
  if (!mounted) {
    // Check if this might be a query param page on server-side
    const mightHaveQueryParams = router.asPath.includes('?');
    if (mightHaveQueryParams) {
      return null; // Don't render canonical on server for any page with query params
    }
  }

  const forceDisableCanonical = !!(
    router.asPath.includes('vehicles_we_armor=') ||
    router.asPath.includes('vehiculos_que_blindamos=') ||
    router.asPath.includes('source=')
  );

  const baseUrl = `https://www.alpineco.com${router.locale !== 'en' ? `/${router.locale}` : ''}`;

  let shouldRenderCanonical = !forceDisableCanonical;
  console.log(
    'Mounted:',
    mounted,
    'shouldRenderCanonical:',
    shouldRenderCanonical
  );

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
