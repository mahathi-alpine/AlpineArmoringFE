import Head from 'next/head';
import React, { useState } from 'react';

import Header from './global/header/Header';
import Footer from './global/footer/Footer';
import NavigationPopup from './global/navigation/NavigationPopup';

const Layout = ({ children }) => {
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Alpine Armoring</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header setNavOpen={setNavOpen} isNavOpen={isNavOpen} />
      <NavigationPopup isNavOpen={isNavOpen} setNavOpen={setNavOpen} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
