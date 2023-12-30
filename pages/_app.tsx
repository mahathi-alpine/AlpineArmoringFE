import '/styles/globals.scss';
import localFont from 'next/font/local';
import Layout from '../components/Layout';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function usePathname() {
  const router = useRouter();
  const { pathname } = router;
  return pathname === '/' ? 'home' : pathname.substring(1);
  return pathname;
}

const termina = localFont({
  src: [
    {
      path: '../public/fonts/Termina-Light.woff2',
      weight: '300',
      style: 'normal',
      // display: 'swap',
      // preload: true,
    },
    {
      path: '../public/fonts/Termina-Regular.woff2',
      weight: '400',
      style: 'normal',
      // display: 'swap',
      // preload: true,
    },
    {
      path: '../public/fonts/Termina-Medium.woff2',
      weight: '500',
      style: 'normal',
      // display: 'swap',
      // preload: true,
    },
    {
      path: '../public/fonts/Termina-Demi.woff2',
      weight: '600',
      style: 'normal',
      // display: 'swap',
      // preload: true,
    },
    {
      path: '../public/fonts/Termina-Bold.woff2',
      weight: '700',
      style: 'normal',
      // display: 'swap',
      // preload: true,
    },
  ],
});

export default function App({ Component, pageProps }) {
  const path = usePathname();
  const [oldPath, setOldPath] = useState('');

  useEffect(() => {
    if (oldPath !== '' && oldPath !== path) {
      document.body.classList.remove(oldPath);
    }
    document.body.classList.add(path);
    setOldPath(path);
  }, [path]);

  return (
    <>
      <Script src="/translation.js" strategy="afterInteractive" />
      {process.env.GOOGLE_TRANSLATION_CONFIG && (
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      )}
      <Layout>
        <main className={termina.className}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
