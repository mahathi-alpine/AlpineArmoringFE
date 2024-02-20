import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Logo from 'components/icons/Logo';
import Button from 'components/global/button/Button';
import Navigation from 'components/global/navigation/Navigation';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import { HeaderProps } from 'types';
import SearchIcon from 'components/icons/Search';
const LanguageSwitcher = dynamic(
  () => import('components/global/lang-switcher/LangSwitcher')
);
// import { LanguageSwitcher } from 'components/global/lang-switcher/LangSwitcher';

const Header = ({
  setNavOpen,
  isNavOpen,
  isDarkMode,
  isHomepage,
  isNotSticky,
  openSearchPopup,
}: HeaderProps) => {
  const [hState, sethState] = React.useState('-top');

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.marginRight =
        window.innerWidth - document.body.offsetWidth + 'px';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.marginRight = '0';
      document.body.classList.remove('no-scroll');
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

  const [isSearchOpen, setSearchOpen] = useState(false);
  const handleSearchClick = () => {
    setSearchOpen(!isSearchOpen);
    openSearchPopup(!isSearchOpen);
  };

  return (
    <header
      className={`
        ${styles.header}
        ${styles[hState]}
        ${isDarkMode ? styles.header_transparent : ''}
        ${isNavOpen ? styles.header_navOpen : ''}
        ${isNotSticky ? styles.header_notSticky : ''}
        ${isHomepage ? styles.header_homepage : ''}        
        b-header
      `}
    >
      <div className={`${styles.header_wrapper} container`}>
        <div
          className={`${styles.header_logo}`}
          onClick={() => setNavOpen(false)}
        >
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>

        <Navigation isNavOpen={isNavOpen} />

        <div className={`${styles.header_right}`}>
          <Button
            href="/contact"
            className={`${styles.header_contact} rounded shiny transparent uppercase desktop-only`}
          >
            Contact
          </Button>

          <div
            // onClick={handleSearchClick}
            onClick={() => {
              setNavOpen(false);
              handleSearchClick();
            }}
            className={`${styles.header_search} desktop-only`}
          >
            {isSearchOpen ? 'X' : <SearchIcon />}
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
