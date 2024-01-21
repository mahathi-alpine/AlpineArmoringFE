import Head from 'next/head';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Header from './global/header/Header';
import Footer from './global/footer/Footer';
import NavigationPopup from './global/navigation/NavigationPopup';

const Layout = ({ children }) => {
  const router = useRouter();

  const pathsDarkMode = ['/available-now'];
  const pathsDarkHeader = ['/vehicles-we-armor', '/contact'];

  const isDarkMode = pathsDarkMode.some((path) =>
    router.pathname.startsWith(path)
  );
  const isDarkHeader = pathsDarkHeader.some((path) =>
    router.pathname.startsWith(path)
  );

  const isNotSticky = /^\/vehicles-we-armor\/.+/.test(router.pathname);

  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Alpine Armoring</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header
        isDarkMode={isDarkMode}
        setNavOpen={setNavOpen}
        isNavOpen={isNavOpen}
        isDarkHeader={isDarkHeader}
        isNotSticky={isNotSticky}
      />
      <NavigationPopup isNavOpen={isNavOpen} setNavOpen={setNavOpen} />
      {children}
      <Footer isDarkMode={isDarkMode} />
    </>
  );
};

export default Layout;
