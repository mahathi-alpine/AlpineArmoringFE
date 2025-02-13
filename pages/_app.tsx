import '/styles/globals.scss';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import Loader from 'components/global/loader/Loader';
import { install } from 'resize-observer';
import CookieConsent from 'components/global/cookie-consent/CookieConsent';

export default function App({ Component, pageProps }) {
  const seoData = pageProps.seoData;
  const [isLoading, setIsLoading] = useState(false);

  if (typeof window !== 'undefined') {
    if (!window.ResizeObserver) install();
  }

  useEffect(() => {
    const paths = ['/available-now', '/vehicles-we-armor'];

    const handleChangeStart = (url: string) => {
      const isTargetPath = paths.some((path) => {
        const regex = new RegExp(path.replace('[slug]', '.*'));
        return regex.test(url);
      });

      setIsLoading(isTargetPath);
    };

    const handleChangeEnd = (url: string) => {
      const isTargetPath = paths.some((path) => {
        const regex = new RegExp(path.replace('[slug]', '.*'));
        return regex.test(url);
      });

      if (isTargetPath) {
        setIsLoading(false);
      }
    };

    Router.events.on('routeChangeStart', handleChangeStart);
    Router.events.on('routeChangeComplete', handleChangeEnd);
    Router.events.on('routeChangeError', handleChangeEnd);

    return () => {
      Router.events.off('routeChangeStart', handleChangeStart);
      Router.events.off('routeChangeComplete', handleChangeEnd);
      Router.events.off('routeChangeError', handleChangeEnd);
    };
  }, []);

  return (
    <>
      {seoData && <Seo key="global-seo" props={seoData} />}
      <Layout>
        {isLoading ? <Loader /> : null}
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </>
  );
}
