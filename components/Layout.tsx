// import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Seo from '../components/Seo';
import { useRouter } from 'next/router';
import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import useLocale from 'hooks/useLocale';

import Header from './global/header/Header';
import Footer from './global/footer/Footer';
const NavigationPopup = dynamic(
  () => import('components/global/navigation/NavigationPopup'),
  {
    ssr: false,
  }
);
const Search = dynamic(() => import('components/global/search/Search'), {
  ssr: false,
});
const ScrollToTopButton = dynamic(
  () => import('components/global/scroll-to-top-button/ScrollToTopButton'),
  {
    ssr: false,
  }
);

const termina = localFont({
  src: [
    {
      path: '../public/fonts/Termina-Light.woff2',
      weight: '300',
      style: 'normal',
    },
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
  preload: true,
});

const Layout = ({ children, seoData }) => {
  const router = useRouter();
  const { lang } = useLocale();

  const pathsDarkMode = [
    '/available-now',
    '/rental-vehicles',
    '/manufacturing',
    '/sold-vehicles',
    '/ballistic-testing',
  ];
  const pathsDarkFooter = ['/manufacturing', '/ballistic-testing'];
  const pathsPadding0 = [
    '/news/',
    '/blog/',
    '/ballistic-testing',
    '/locations-we-serve',
  ];
  const footerPadding0 = ['/available-now'];

  const isDarkMode = pathsDarkMode.some((path) =>
    router.pathname.startsWith(path)
  );
  const isDarkFooter = pathsDarkFooter.some((path) =>
    router.pathname.startsWith(path)
  );
  const isFooterPadding0 = footerPadding0.some(
    (path) =>
      router.pathname === path ||
      (router.pathname.startsWith(`/available-now/type/`) &&
        router.pathname.split('/').length === 4)
  );

  const isHomepage = router.pathname === '/';

  const pathsHeaderTransparent = ['/ballistic-testing'];
  const isHeaderGray = pathsHeaderTransparent.some(
    (path) => router.pathname.startsWith(path) || isHomepage
  );

  const isPadding0 = pathsPadding0.some((path) =>
    router.pathname.startsWith(path)
  );

  const [isNavOpen, setNavOpen] = useState(false);

  // Search
  const [isSearchVisible, setSearchVisibility] = useState(false);

  const openSearchPopup = (visible) => {
    setSearchVisibility(visible);
    if (visible) {
      setNavOpen(false);
    }
    setTimeout(() => {
      const input = document.querySelector('.search-box') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  };

  useEffect(() => {
    openSearchPopup(false);
    setNavOpen(false);
  }, [router.pathname]);

  const shouldDisableCanonical = router.asPath.includes('vehicles_we_armor=');

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-1066421391"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-1066421391');
          `,
        }}
      />

      {/* Google Tag Manager */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K9624Z4S');
          `,
        }}
      />

      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K9624Z4S"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
          aria-hidden="true"
        />
      </noscript>

      {seoData && (
        <Seo
          props={{
            ...seoData,
            canonicalURL: shouldDisableCanonical ? false : seoData.canonicalURL,
            languageUrls: shouldDisableCanonical ? false : seoData.languageUrls,
          }}
          isDarkMode={isDarkMode}
          isPadding0={isPadding0}
          isHomepage={isHomepage}
          isHeaderGray={isHeaderGray}
        />
      )}

      <div className={termina.className}>
        <Header
          isDarkMode={isDarkMode || isSearchVisible}
          setNavOpen={setNavOpen}
          isNavOpen={isNavOpen}
          isHeaderGray={isHeaderGray}
          openSearchPopup={openSearchPopup}
          isSearchVisible={isSearchVisible}
        />

        {isSearchVisible && <Search openSearchPopup={openSearchPopup} />}

        <NavigationPopup
          isNavOpen={isNavOpen}
          setNavOpen={setNavOpen}
          openSearchPopup={openSearchPopup}
        />

        {children}

        <ScrollToTopButton />

        <a
          href="https://wa.me/message/ZKTQXXVR7PGQL1"
          className="WABusiness"
          target="_blank"
          rel="nofollow"
          aria-label="WhatsApp Chat Button"
        >
          <div className="WABusiness_icon"></div>
          <span className="WABusiness_text desktop-only">
            {lang.chatWithUs}
          </span>
        </a>

        <Footer isDarkMode={isDarkFooter} isFooterPadding0={isFooterPadding0} />
      </div>
    </>
  );
};

export default Layout;
