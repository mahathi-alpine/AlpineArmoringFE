import Head from 'next/head';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import localFont from 'next/font/local';
import dynamic from 'next/dynamic';

import Header from './global/header/Header';
import Footer from './global/footer/Footer';
const NavigationPopup = dynamic(
  () => import('components/global/navigation/NavigationPopup')
);
const Search = dynamic(() => import('components/global/search/Search'));
const ScrollToTopButton = dynamic(
  () => import('components/global/scroll-to-top-button/ScrollToTopButton')
);

const termina = localFont({
  src: [
    {
      path: '../public/fonts/Termina-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Termina-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Termina-Demi.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
});

const Layout = ({ children }) => {
  const router = useRouter();

  const pathsDarkMode = ['/available-now', '/manufacturing', '/sold-vehicles'];
  const pathsDarkFooter = ['/manufacturing'];
  const pathsPadding0 = ['/news'];

  const isDarkMode = pathsDarkMode.some((path) =>
    router.pathname.startsWith(path)
  );
  const isDarkFooter = pathsDarkFooter.some((path) =>
    router.pathname.startsWith(path)
  );
  const isHomepage = router.pathname === '/';
  const isPadding0 = pathsPadding0.some((path) =>
    router.pathname.startsWith(path)
  );

  const isNotSticky = /^\/vehicles-we-armor\/.+/.test(router.pathname);

  const [isNavOpen, setNavOpen] = useState(false);

  // Search
  const [isSearchVisible, setSearchVisibility] = useState(false);

  const openSearchPopup = (visible) => {
    setSearchVisibility(visible);
  };

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
        {(isPadding0 || isHomepage) && (
          <style>{`
              body {
                padding-top: 0 !important;
              }
            `}</style>
        )}
        {isHomepage && (
          <style>{`
              header{
                background-color: rgba(23, 23, 23, 0.8);
                backdrop-filter: blur(10px);
              }
            `}</style>
        )}
      </Head>

      <div className={termina.className}>
        <Header
          isDarkMode={isDarkMode}
          setNavOpen={setNavOpen}
          isNavOpen={isNavOpen}
          isHomepage={isHomepage}
          isNotSticky={isNotSticky}
          openSearchPopup={openSearchPopup}
        />

        {isSearchVisible && <Search />}

        <NavigationPopup
          isNavOpen={isNavOpen}
          setNavOpen={setNavOpen}
          openSearchPopup={openSearchPopup}
        />

        {children}

        <ScrollToTopButton />

        <Footer isDarkMode={isDarkFooter} />
      </div>
    </>
  );
};

export default Layout;
