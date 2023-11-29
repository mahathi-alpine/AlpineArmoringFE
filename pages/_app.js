import '../styles/globals.scss';
import { useEffect } from 'react';
// import Layout from '../components/global/Layout';
import localFont from 'next/font/local'
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';

const termina = localFont({
  src: [
    {
      path: '../public/fonts/Termina-Regular.woff2',
      weight: '400',
      style: 'normal',
      display: 'swap',
      preload: true
    },
    {
      path: '../public/fonts/Termina-Medium.woff2',
      weight: '500',
      style: 'normal',
      display: 'swap',
      preload: true
    },
    {
      path: '../public/fonts/Termina-Demi.woff2',
      weight: '600',
      style: 'normal',
      display: 'swap',
      preload: true
    },
    {
      path: '../public/fonts/Termina-Bold.woff2',
      weight: '700',
      style: 'normal',
      display: 'swap',
      preload: true
    },
  ],
 })

function MyApp({ Component, pageProps }) {
  return (
    // <Layout>
      <main className={termina.className}>
        <Header className="header--white" />
        <Component {...pageProps} />
        <Footer />
      </main>
    // </Layout>
  );
}

export default MyApp

