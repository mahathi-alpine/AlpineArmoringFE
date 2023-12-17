// import React, { FC } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Navigation from 'components/global/navigation/Navigation';
import styles from './Header.module.scss';
import { useEffect} from 'react';
import { HeaderProps } from 'types';

// interface HeaderProps {
//   className?: string;
//   isNavOpen? : boolean;
//   setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
// }

const Header = ({ className, setNavOpen, isNavOpen }: HeaderProps) => {
  // const [isScrolling, setIsScrolling] = React.useState(false);

  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isNavOpen]);

  // useEffect(() => {
  //   const checkScroll = () => {
  //     setIsScrolling(window.scrollY > 0);
  //   };
   
  //   window.addEventListener('scroll', checkScroll);
   
  //   return () => {
  //     window.removeEventListener('scroll', checkScroll);
  //   };
  // }, []);

  const classNames = className
    ?.split(' ')
    .map((name) => styles[name])
    .join(' ');

  return (
    <header 
      className={`
        ${styles.header} 
        ${classNames} 
        ${isNavOpen ? styles.header_navOpen : ''}
      `}
      // ${isScrolling ? styles.header_sticky : ''}
    >
      <div className={`${styles.header_wrapper} container`}>
        <div className={`${styles.header_logo}`}>
          <Link href={'/'}>
            <Image
              src="/AlpineArmoringLogoWhite.svg"
              width={125}
              height={42}
              alt="Alpine Armoring"
              priority={true}
            />
          </Link>
        </div>

        <Navigation isNavOpen={isNavOpen} />

        <div className={`${styles.header_right}`}>
          <Button
            href="/contact"
            desktopOnly
            className="button-shiny transparent button_small button_uppercase desktop-only"
          >
            Contact
          </Button>

          <Image
            src="/assets/search.svg"
            width={25}
            height={32}
            alt="Alpine Armoring Search"
            className="desktop-only"
          />

          <div className={`${styles.header_lang} desktop-only`}>EN</div>

          <div 
            className={`${styles.header_burger}`}
            onClick={() => setNavOpen(prevState => !prevState)}
          >
            <div className={`${styles.header_burger_inner}`}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
