import { useEffect } from 'react';

export default function Custom404() {
  useEffect(() => {
    document.body.classList.add('p0');
    return () => {
      document.body.classList.remove('p0');
    };
  }, []);

  return (
    <>
      <div className="errorPage">
        <h1 className="errorPage_h1">404</h1>
        <h2 className="errorPage_h2">Not Found</h2>
        <div className="errorPage_gradient"></div>
      </div>
      <div className="shape-before shape-before-white"></div>
    </>
  );
}
