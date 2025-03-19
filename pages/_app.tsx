import '/styles/globals.scss';
import Layout from '../components/Layout';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import useLocale from 'hooks/useLocale';
import Loader from 'components/global/loader/Loader';
import { install } from 'resize-observer';
import useLanguageSwitcher from 'hooks/useLanguageSwitcher';
import CookieConsent from 'components/global/cookie-consent/CookieConsent';

export default function App({ Component, pageProps }) {
  const { lang } = useLocale();
  const router = useRouter();
  const [currentSeoData, setCurrentSeoData] = useState(pageProps.seoData);
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguageSwitcher();

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

  return (
    <>
      {currentSeoData && (
        <Seo key={`seo-${router.locale}`} props={currentSeoData} />
      )}
      <Layout>
        {isLoading ? <Loader /> : null}
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </>
  );
}
