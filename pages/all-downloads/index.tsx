import { useEffect } from 'react';
import Head from 'next/head';
import Button from 'components/global/button/Button';

export default function Custom404() {
  useEffect(() => {
    document.body.classList.add('p0');
    return () => {
      document.body.classList.remove('p0');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Coming Soon - Alpine Armoring</title>
      </Head>
      <div className="errorPage">
        <div className="container_small">
          <h2 className="errorPage_h2">ALL DOWNLOADS</h2>
          <h2 className="errorPage_h2">COMING SOON!</h2>

          <Button href={`/`} className={`primary rounded`}>
            Go to homepage
          </Button>

          <div className="errorPage_gradient"></div>
        </div>
      </div>
      <div className="shape-before shape-before-white"></div>
    </>
  );
}
