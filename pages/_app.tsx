import '/styles/globals.scss';
// import LogRocket from 'logrocket';
import { install } from 'resize-observer';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
// import Seo from '../components/Seo';
import useLocale from 'hooks/useLocale';
import Loader from 'components/global/loader/Loader';
import CookieConsent from 'components/global/cookie-consent/CookieConsent';

// Load GoogleAdsTracking only on client-side to prevent Safari SSR issues
const GoogleAdsTracking = dynamic(
  () => import('components/GoogleAdsTracking'),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const { lang } = useLocale();
  const router = useRouter();
  const [currentSeoData, setCurrentSeoData] = useState(pageProps.seoData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // useEffect(() => {
  //   if (
  //     typeof window !== 'undefined' &&
  //     process.env.NODE_ENV === 'production'
  //   ) {
  //     const disableLogging =
  //       localStorage.getItem('disable_logrocket') === 'true';

  //     try {
  //       if (!disableLogging) {
  //         LogRocket.init('md2s86/alpine');
  //       }
  //     } catch (error) {
  //       console.error('LogRocket initialization failed:', error);
  //     }
  //   }
  // }, []);

  // Update language when route changes
  useEffect(() => {
    setCurrentLanguage(router.locale);
  }, [router.locale]);

  // Update SEO data when pageProps changes (including after locale changes)
  useEffect(() => {
    if (pageProps.seoData) {
      setCurrentSeoData(pageProps.seoData);
    }
  }, [pageProps.seoData]);

  if (typeof window !== 'undefined') {
    if (!window.ResizeObserver) install();
  }

  useEffect(() => {
    const paths = [
      lang.availableNowURL,
      lang.vehiclesWeArmorURL,
      lang.armoredVehiclesForSaleURL,
    ];

    const handleStart = (url: string) => {
      const isTargetPath = paths.some((path) => url.includes(path));
      setIsLoading(isTargetPath);
    };

    const handleEnd = () => setIsLoading(false);

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleEnd);
    Router.events.on('routeChangeError', handleEnd);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleEnd);
      Router.events.off('routeChangeError', handleEnd);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage || 'en-us';

    const bodyElement = document.body;
    const languageClasses = Array.from(bodyElement.classList).filter((cls) =>
      cls.startsWith('lang-')
    );
    languageClasses.forEach((cls) => bodyElement.classList.remove(cls));

    if (currentLanguage) {
      bodyElement.classList.add(`lang-${currentLanguage}`);
    } else {
      bodyElement.classList.add('lang-en');
    }
  }, [currentLanguage]);

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     if (
  //       url.startsWith('/es/') &&
  //       url != '/es/contacto' &&
  //       url != '/es/hacerca-de-nosotros'
  //     ) {
  //       window.location.href = url;
  //       return;
  //     }
  //   };

  //   router.events.on('routeChangeStart', handleRouteChange);
  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, [router]);

  return (
    <>
      {/* {currentSeoData && (
        <Seo key={`seo-${router.locale}`} props={currentSeoData} />
      )} */}
      <GoogleAdsTracking />
      <Layout seoData={currentSeoData}>
        {isLoading ? <Loader /> : null}
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </>
  );
}
