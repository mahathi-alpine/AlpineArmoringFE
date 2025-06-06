import '/styles/globals.scss';
import { install } from 'resize-observer';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
// import Seo from '../components/Seo';
import useLocale from 'hooks/useLocale';
import Loader from 'components/global/loader/Loader';
import CookieConsent from 'components/global/cookie-consent/CookieConsent';

export default function App({ Component, pageProps }) {
  const { lang } = useLocale();
  const router = useRouter();
  const [currentSeoData, setCurrentSeoData] = useState(pageProps.seoData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

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

  return (
    <>
      {/* {currentSeoData && (
        <Seo key={`seo-${router.locale}`} props={currentSeoData} />
      )} */}
      <Layout seoData={currentSeoData}>
        {isLoading ? <Loader /> : null}
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </>
  );
}
