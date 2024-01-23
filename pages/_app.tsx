import '/styles/globals.scss';
import Layout from '../components/Layout';
import Script from 'next/script';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

// export function usePathname() {
//   const router = useRouter();
//   const { pathname } = router;
//   return pathname === '/' ? 'home' : pathname.substring(1);
// }

export default function App({ Component, pageProps }) {
  // const path = usePathname();
  // const [oldPath, setOldPath] = useState('');

  // useEffect(() => {
  //   const _oldPath = oldPath;
  //   if (_oldPath !== '' && _oldPath !== path) {
  //     document.body.classList.remove(_oldPath);
  //   }
  //   document.body.classList.add(path);
  //   setOldPath(path);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [path]);

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
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
