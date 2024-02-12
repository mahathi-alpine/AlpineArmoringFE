import Head from 'next/head';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import localFont from 'next/font/local';

import Header from './global/header/Header';
import Footer from './global/footer/Footer';
import NavigationPopup from './global/navigation/NavigationPopup';

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

const Layout = ({ children }) => {
  const router = useRouter();

  const pathsDarkMode = ['/available-now', '/manufacturing'];
  const pathsDarkHeader = [
    '/vehicles-we-armor',
    '/contact',
    '/about-us',
    '/design-and-engineering',
    '/shipping-and-logistics',
    '/become-a-dealer',
    '/faqs',
    '/blog',
  ];
  const pathsDarkFooter = ['/manufacturing'];
  const pathsPadding0 = ['/', '/blog'];

  const isDarkMode = pathsDarkMode.some((path) =>
    router.pathname.startsWith(path)
  );
  const isDarkHeader = pathsDarkHeader.some((path) =>
    router.pathname.startsWith(path)
  );
  const isDarkFooter = pathsDarkFooter.some((path) =>
    router.pathname.startsWith(path)
  );
  const isPadding0 = pathsPadding0.some((path) =>
    router.pathname.startsWith(path)
  );
  // const isPadding0 = router.pathname === '/' || router.pathname === '/blog';

  const isNotSticky = /^\/vehicles-we-armor\/.+/.test(router.pathname);

  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Alpine Armoring</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {isDarkMode && (
          <style>{`
              body {
                background: #101010 url(/assets/noise4.png) !important;
                background-size: 30px !important;
              }
            `}</style>
        )}
        {isPadding0 && (
          <style>{`
              body {
                padding-top: 0 !important;
              }
            `}</style>
        )}
      </Head>

      <div className={termina.className}>
        <Header
          isDarkMode={isDarkMode}
          setNavOpen={setNavOpen}
          isNavOpen={isNavOpen}
          isDarkHeader={isDarkHeader}
          isNotSticky={isNotSticky}
        />

        <NavigationPopup isNavOpen={isNavOpen} setNavOpen={setNavOpen} />

        {children}

        <Footer isDarkMode={isDarkFooter} />
      </div>
    </>
  );
};

export default Layout;
