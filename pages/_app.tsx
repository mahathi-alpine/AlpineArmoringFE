import '/styles/globals.scss';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import Loader from 'components/global/loader/Loader';
import { install } from 'resize-observer';
import LogRocket from 'logrocket';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function App({ Component, pageProps }) {
  const seoData = pageProps.seoData;
  const [isLoading, setIsLoading] = useState(false);

  if (typeof window !== 'undefined') {
    if (!window.ResizeObserver) install();
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('test');
      LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);
    }
  }, []);

  useEffect(() => {
    const paths = [
      '/available-now',
      // '/available-now/[slug]',
      '/vehicles-we-armor',
      // '/vehicles-we-armor/[slug]',
    ];

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
    document.documentElement.lang = 'en-us';

    const cookieValue = getCookie('googtrans');
    if (cookieValue) {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=TranslateInit';
      script.async = true;
      script.onload = () => {
        window.TranslateInit = function () {
          new window.google.translate.TranslateElement();
        };
        // window.TranslateInit();
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=123"
      /> */}

      {/* <Script
        strategy="lazyOnload"
        src="cookie, chatbots, newsletter"
      /> */}

      {/* <Script id="script-translate" strategy="afterInteractive">
        {`
          window.TranslateInit = function () {
            new window.google.translate.TranslateElement();
          };        
        `}
      </Script> */}
      {/* {process.env.GOOGLE_TRANSLATION_CONFIG && (
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      )} */}

      <Seo props={seoData} />
      <Layout>
        {isLoading ? <Loader type="4" /> : null}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
