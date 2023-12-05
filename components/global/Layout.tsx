import React from 'react';
import Header from './header/Header';
// import Footer from './Footer';
// import BackToTop from './BackToTop';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="content">{children}</div>
      {/* <Footer /> */}
      {/* <BackToTop /> */}
    </>
  );
};

export default Layout;
