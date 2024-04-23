import '/styles/globals.scss';
import Layout from '../components/Layout';
import Router from 'next/router';
// import Script from 'next/script';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import Loader from 'components/global/loader/Loader';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function App({ Component, pageProps }) {
  const seoData = pageProps.seoData;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const paths = [
      '/available-now',
      '/available-now/[slug]',
      '/vehicles-we-armor',
      '/vehicles-we-armor/[slug]',
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
  }, []);

  // useEffect(() => {
  //   document.documentElement.lang = 'en-us';
  // }, []);

  useEffect(() => {
    // Check if the cookie exists
    const cookieValue = getCookie('googtrans');
    if (cookieValue) {
      // Load the Google Translate script if the cookie is set
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=TranslateInit';
      script.async = true;
      script.onload = () => {
        // Ensure the TranslateInit function is called after the script loads
        window.TranslateInit = function () {
          new window.google.translate.TranslateElement();
        };
        // window.TranslateInit(); // Call the function immediately after the script loads
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
        {isLoading ? <Loader type="1" /> : null}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
