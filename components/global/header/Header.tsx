import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import Logo from 'components/icons/Logo';
import Navigation from 'components/global/navigation/Navigation';
import styles from './Header.module.scss';
import { HeaderProps } from 'types';
import SearchIcon from 'components/icons/Search';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from 'components/global/lang-switcher/LangSwitcher';

const Header = ({
  setNavOpen,
  isNavOpen,
  isDarkMode,
  isHeaderGray,
  openSearchPopup,
  isSearchVisible,
}: HeaderProps) => {
  const [hState, sethState] = useState('-top');
  const router = useRouter();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const handleSearchClick = useCallback(() => {
    setSearchOpen((prevState) => {
      const newState = !prevState;
      openSearchPopup(newState);
      return newState;
    });
    setTimeout(() => {
      const input = document.querySelector('.search-box') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }, [openSearchPopup]);

  useEffect(() => {
    const handleRouteChange = () => {
      setSearchOpen(false);
      openSearchPopup(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, openSearchPopup]);

  useEffect(() => {
    if (isNavOpen || isSearchOpen) {
      document.body.style.marginRight =
        window.innerWidth - document.body.offsetWidth + 'px';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.marginRight = '0';
      document.body.classList.remove('no-scroll');
    }
  }, [isNavOpen, isSearchOpen]);

  useEffect(() => {
    let lastVal = 66;

    const y = window.scrollY;
    if (y > lastVal) {
      sethState('down');
    }

    const handleScroll = () => {
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        ${styles.header}
        ${styles[hState]}
        ${isDarkMode ? styles.header_transparent : ''}
        ${isNavOpen ? styles.header_navOpen : ''}
        ${isHeaderGray ? styles.header_gray : ''}      
        b-header
      `}
    >
      <div className={`${styles.header_wrapper} container`}>
        <div
          className={`${styles.header_logo}`}
          onClick={() => setNavOpen(false)}
        >
          <Link href={'/'} aria-label="Alpine Armoring Logo">
            <Image
              src="/assets/Alpine-Armoring-Armored-Vehicles.png"
              alt="armored vehicles"
              width={125}
              height={42}
              quality={100}
              priority
              unoptimized
              className={`${styles.header_logo_gold} header_logo_gold`}
            />
            {/* <Image
              src="/assets/Alpine-Armoring-Armored-Vehicles-black.png"
              alt="armored vehicles"
              width={125}
              height={42}
              quality={100}
              priority
              className={`${styles.header_logo_black} header_logo_black`}
            /> */}
            <Logo className={`${styles.header_logo_black} header_logo_black`} />
          </Link>
        </div>

        <Navigation isNavOpen={isNavOpen} />

        <div className={`${styles.header_right}`}>
          <Button
            href="/contact"
            className={`${styles.header_contact} rounded shiny transparent uppercase desktop-only`}
          >
            <span onClick={() => setNavOpen(false)}>Contact</span>
          </Button>

          <div
            onClick={() => {
              setNavOpen(false);
              handleSearchClick();
            }}
            className={`${styles.header_search} desktop-only`}
          >
            {isSearchVisible ? 'X' : <SearchIcon />}
          </div>

          <LanguageSwitcher className={`desktop-only`} />

          <div
            className={`${styles.header_burger}`}
            onClick={() => {
              setNavOpen((prevState) => !prevState);
              openSearchPopup(false);
            }}
          >
            <div className={`${styles.header_burger_inner}`}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
