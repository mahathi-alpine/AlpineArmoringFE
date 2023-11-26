import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/AlpineArmoringLogoDark.svg';
import SearchIcon from '../../public/assets/Search.png';
import Button from './Button';
import Navigation from './Navigation';
import styles from './Header.module.scss';

// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import SearchIcon from '../icons/SearchIcon.js';

const Header = () => {
//   const router = useRouter();
//   const { locale, locales, pathname, query } = router;

//   useEffect(() => {
//     const scrollNav = () => {
//       setScrollState(window.scrollY);
//     };

//     if (window.innerWidth >= 1024) {
//       window.addEventListener('scroll', scrollNav);

//       return () => {
//         window.removeEventListener('scroll', scrollNav);
//       };
//     }
//   });

  return (
    <>
      <header className={`${styles.header}`}>
        <div className={`${styles.header_wrapper}`}>

          <div className={`${styles.header_logo}`}>
            <Link href={'/'}>
                <Image
                    src={logo}
                    width={125}                    
                    height={42}
                    alt="Alpine Armoring"
                />
            </Link>
          </div>

          <Navigation/>

          <div className={`${styles.header_right}`}>

            <Button href="/contact" desktopOnly className="primary button--small desktop-only">Contact</Button>

            <Image
              src={SearchIcon}
              width={20}                    
              height={20}
              alt="Alpine Armoring Search"
              className="desktop-only"
            />

            <div className={`${styles.header_lang} desktop-only`}>EN</div>

            <div className={`${styles.header_burger}`}></div>

          </div>

        </div>
      </header>
    </>
  );
};

export default Header;