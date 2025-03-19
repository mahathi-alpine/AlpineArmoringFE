import '/styles/globals.scss';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import Loader from 'components/global/loader/Loader';
import { install } from 'resize-observer';
import useLanguageSwitcher from 'hooks/useLanguageSwitcher';
import CookieConsent from 'components/global/cookie-consent/CookieConsent';

export default function App({ Component, pageProps }) {
  const { lang } = useLocale();

  const seoData = pageProps.seoData;
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguageSwitcher();

  if (typeof window !== 'undefined') {
    if (!window.ResizeObserver) install();
  }

  useEffect(() => {
    const paths = [lang.availableNowURL, lang.vehiclesWeArmorURL];

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

  useEffect(() => {
    document.documentElement.lang = currentLanguage || 'en-us';

    if (currentLanguage && currentLanguage !== 'en') {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=TranslateInit';
      script.async = true;
      script.onload = () => {
        window.TranslateInit = function () {
          new window.google.translate.TranslateElement();
        };
      };
      document.body.appendChild(script);
    }
  }, [currentLanguage]);

  const router = useRouter();
  useEffect(() => {
    // Log locale changes
    console.log('Client-side locale:', router.locale);
    console.log('Available locales:', router.locales);
    console.log('Page props:', pageProps);

    // Add event listeners to debug navigation
    const handleRouteChangeStart = (url) => {
      console.log('Route change starting to:', url);
    };

    const handleRouteChangeComplete = (url) => {
      console.log(
        'Route change completed to:',
        url,
        'with locale:',
        router.locale
      );
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {seoData && <Seo key="global-seo" props={seoData} />}
      <Layout>
        {isLoading ? <Loader /> : null}
        <Component {...pageProps} key={router.locale} />
        <CookieConsent />
      </Layout>
    </>
  );
}
