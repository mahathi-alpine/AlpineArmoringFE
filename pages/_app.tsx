import '/styles/globals.scss';
import Layout from '../components/Layout';
import Script from 'next/script';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=123"
      /> */}
      <Script id="script-translate" strategy="afterInteractive">
        {`
          window.TranslateInit = function () {
            new window.google.translate.TranslateElement();
          };        
        `}
      </Script>
      {process.env.GOOGLE_TRANSLATION_CONFIG && (
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      )}
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
