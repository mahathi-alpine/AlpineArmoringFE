import React from 'react';
import '../styles/globals.scss';
// import Layout from '../components/global/Layout';
import localFont from 'next/font/local';
import Header from '../components/global/header/Header';
import Footer from '../components/global/footer/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next";

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

function MyApp({ Component, pageProps }) {
  return (
    // <Layout>
    <main className={termina.className}>
      <Header className="header--white" />
      <Component {...pageProps} />
      <Footer />
      <SpeedInsights/>
    </main>
    // </Layout>
  );
}

export default MyApp;
