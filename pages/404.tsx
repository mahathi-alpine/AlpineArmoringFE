import { useEffect } from 'react';
import Head from 'next/head';
import useLocale from 'hooks/useLocale';
import Button from 'components/global/button/Button';

export default function Custom404() {
  const { lang } = useLocale();

  useEffect(() => {
    document.body.classList.add('p0');
    return () => {
      document.body.classList.remove('p0');
    };
  }, []);

  return (
    <>
      <Head>
        <title>{lang.pageNotFound} - Alpine Armoring</title>
      </Head>
      <div className="errorPage">
        <div className="container_small">
          <h1 className="errorPage_h1">404</h1>
          <h2 className="errorPage_h2">{lang.pageDoesNotExist}</h2>

          <Button href={`/`} className={`primary rounded`}>
            {lang.goToHomepage}
          </Button>

          <div className="errorPage_gradient"></div>
        </div>
      </div>
      <div className="shape-before shape-before-white"></div>
    </>
  );
}
