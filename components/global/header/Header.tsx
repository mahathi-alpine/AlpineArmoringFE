import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Navigation from 'components/global/navigation/Navigation';
import styles from './Header.module.scss';
import {useEffect} from 'react';


interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [isScrolling, setIsScrolling] = React.useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
   
    window.addEventListener('scroll', checkScroll);
   
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
   }, []);

  const classNames = className
    ?.split(' ')
    .map((name) => styles[name])
    .join(' ');
  return (
    <header className={`${styles.header} ${classNames} container ${isScrolling ? styles.header_sticky : ''}`}>
      <div className={`${styles.header_wrapper}`}>
        <div className={`${styles.header_logo}`}>
          <Link href={'/'}>
            <Image
              src="/AlpineArmoringLogoWhite.svg"
              width={100}
              height={30}
              alt="Alpine Armoring"
              priority={true}
            />
          </Link>
        </div>

        <Navigation />

        <div className={`${styles.header_right}`}>
          <Button
            href="/contact"
            desktopOnly
            className="button--small desktop-only"
          >
            Contact
          </Button>

          <Image
            src="/assets/search.svg"
            width={20}
            height={20}
            alt="Alpine Armoring Search"
            className="desktop-only"
          />

          <div className={`${styles.header_lang} desktop-only`}>EN</div>

          <div className={`${styles.header_burger}`}>
            <div className={`${styles.header_burger_inner}`}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
