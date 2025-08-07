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
import useLocale from 'hooks/useLocale';
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
  const { lang } = useLocale();

  const handleSearchClick = useCallback(() => {
    openSearchPopup(!isSearchVisible);
  }, [openSearchPopup, isSearchVisible]);

  useEffect(() => {
    const handleRouteChange = () => {
      openSearchPopup(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, openSearchPopup]);

  useEffect(() => {
    if (isNavOpen || isSearchVisible) {
      document.body.style.marginRight =
        window.innerWidth - document.body.offsetWidth + 'px';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.marginRight = '0';
      document.body.classList.remove('no-scroll');
    }
  }, [isNavOpen, isSearchVisible]);

  useEffect(() => {
    let lastVal = 68;

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
        ${isSearchVisible ? styles.header_searchOpen : ''} 
        b-header
      `}
    >
      <div className={`${styles.header_wrapper} container`}>
        <div
          className={`${styles.header_logo}`}
          onClick={() => setNavOpen(false)}
        >
          <Link href={'/'} aria-label="Alpine Armoring Logo">
            {isDarkMode || isHeaderGray ? (
              <Image
                src="/assets/Alpine-Logo.png"
                alt="Alpine Armoring Armored Vehicles"
                width={125}
                height={42}
                priority
                unoptimized
                className="header_logo_gold"
              />
            ) : (
              <Logo className="header_logo_black" />
            )}
          </Link>
        </div>

        <Navigation isNavOpen={isNavOpen} />

        <div className={`${styles.header_right}`}>
          <Button
            href={lang.contactURL}
            className={`${styles.header_contact} rounded shiny transparent uppercase desktop-only`}
          >
            <span onClick={() => setNavOpen(false)}>{lang.contact}</span>
          </Button>

          <div
            onClick={handleSearchClick}
            className={`${styles.header_search} header_search`}
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
