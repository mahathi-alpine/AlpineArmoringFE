import '/styles/globals.scss';
import Layout from '../components/Layout';
// import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = `https://www.alpineco.com${router.pathname}`;

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
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
