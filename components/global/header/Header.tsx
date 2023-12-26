// import React, { FC } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Navigation from 'components/global/navigation/Navigation';
import styles from './Header.module.scss';
import { useEffect } from 'react';
import { HeaderProps } from 'types';
import SearchIcon from 'components/icons/Search';
import { LanguageSwitcher } from 'components/global/lang-switcher/LangSwitcher';

const Header = ({ className, setNavOpen, isNavOpen }: HeaderProps) => {
  const [hState, sethState] = React.useState('-top');

  useEffect(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 1280) {
      if (isNavOpen) {
        // document.body.style.marginRight = (window.innerWidth - document.body.offsetWidth) + 'px';
        document.body.classList.add('no-scroll');
      } else {
        // document.body.style.marginRight = '0';
        document.body.classList.remove('no-scroll');
      }
    }
  }, [isNavOpen]);

  useEffect(() => {
    let lastVal = 0;
    window.onscroll = function () {
      const y = window.scrollY;
      if (y > lastVal) {
        sethState('down');
      }
      if (y < lastVal) {
        sethState('up');
      }
      if (y === 0) {
        sethState('top');
      }
      lastVal = y;
    };
  }, []);

  const classNames = className
    ?.split(' ')
    .map((name) => styles[name])
    .join(' ');

  return (
    <header
      className={`
        ${styles.header} 
        ${classNames} 
        ${styles[hState]}
        ${isNavOpen ? styles.header_navOpen : ''}
      `}
      // ${isScrolling ? styles.header_sticky : ''}
    >
      <div className={`${styles.header_wrapper} container`}>
        <div
          className={`${styles.header_logo}`}
          onClick={() => setNavOpen(false)}
        >
          <Link href={'/'}>
            <Image
              src="/assets/LogoWhite.svg"
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

          <SearchIcon className={`${styles.header_search} desktop-only`} />

          <LanguageSwitcher className={`desktop-only`} />

          <div
            className={`${styles.header_burger}`}
            onClick={() => setNavOpen((prevState) => !prevState)}
          >
            <div className={`${styles.header_burger_inner}`}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
