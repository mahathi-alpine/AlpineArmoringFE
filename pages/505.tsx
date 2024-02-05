import { useEffect } from 'react';

export default function Custom500() {
  useEffect(() => {
    document.body.classList.add('p0');
    return () => {
      document.body.classList.remove('p0');
    };
  }, []);

  return (
    <>
      <div className="errorPage">
        <h1 className="errorPage_h1">500</h1>
        <h2 className="errorPage_h2">Server-side error occurred</h2>
        <div className="errorPage_gradient"></div>
      </div>
      <div className="shape-before shape-before-white"></div>
    </>
  );
}
