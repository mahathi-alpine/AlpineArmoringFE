import '/styles/globals.scss';
import localFont from 'next/font/local';
import Layout from '../components/Layout';

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
  return (
    <Layout>
      <main className={termina.className}>
        <Component {...pageProps} />
      </main>
   </Layout>
  )
}