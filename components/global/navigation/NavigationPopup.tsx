import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';
import { NavigationProps } from 'types';
import styles from './NavigationPopup.module.scss';

import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import MailIcon from 'components/icons/Mail';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
import SearchIcon from 'components/icons/Search';
import { LanguageSwitcher } from 'components/global/lang-switcher/LangSwitcher';

const NavigationPopup = ({ isNavOpen, setNavOpen }: NavigationProps) => {
  const router = useRouter();

  const links = [
    { path: '/about', text: 'About Us' },
    { path: '/available-now', text: 'Available Now' },
    { path: '/vehicles-we-armor', text: 'Vehicles We Armor' },
  ];

  const linksRight = [
    { path: '/ballisticchart', text: 'Ballistic Chart' },
    { path: '/rental', text: 'Rental vehicles' },
    { path: '/design', text: 'Design and Engineering' },
    { path: '/manufacturing', text: 'Manufacturing' },
    { path: '/shipping', text: 'Shipping and Logistics' },
    { path: '/parts', text: 'Parts and Accessories' },
    { path: '/dealer', text: 'Become a Dealer' },
    { path: '/contact', text: 'Contact' },
  ];

  return (
    <nav
      className={`${styles.navigationPopup} ${
        isNavOpen ? styles.navigationPopup_open : ''
      }`}
    >
      <div className={`${styles.navigationPopup_inner} container`}>
        <div className={`${styles.navigationPopup_nav}`}>
          <ul
            className={`${styles.navigationPopup_list_left} ${styles.navigationPopup_list}`}
          >
            {links.map((link, index) => (
              <li
                key={index}
                className={`
                  ${styles.navigationPopup_item} 
                  ${
                    router.pathname === link.path
                      ? `${styles.navigationPopup_item_active}`
                      : ''
                  }`}
                onClick={() => setNavOpen(false)}
              >
                <Link
                  className={`${styles.navigationPopup_link}`}
                  href={link.path}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>

          <ul
            className={`${styles.navigationPopup_list_right} ${styles.navigationPopup_list}`}
          >
            {linksRight.map((link, index) => (
              <li
                key={index}
                className={`
                ${styles.navigationPopup_item} 
                ${
                  router.pathname === link.path
                    ? `${styles.navigationPopup_item_active}`
                    : ''
                }`}
              >
                <Link
                  className={`${styles.navigationPopup_link}`}
                  href={link.path}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.navigationPopup_info}`}>
          <div className={`${styles.navigationPopup_contact}`}>
            <Link
              href="tel:+17034710002"
              className={`${styles.navigationPopup_contact_item}`}
            >
              <PhoneIcon />
              1.703.471.0002
            </Link>
            <Link
              href="mailto:sales@alpineco.com"
              className={`${styles.navigationPopup_contact_item}`}
            >
              <MailIcon />
              sales@AlpineCo.com
            </Link>

            <Link
              href="https://maps.app.goo.gl/H49yxzm1B3ZMRqLbA"
              target="_blank"
              className={`${styles.navigationPopup_contact_item}`}
            >
              <MapIcon />
              Chantilly, Virginia, USA
            </Link>
          </div>

          <ul className={`${styles.navigationPopup_socials}`}>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.facebook.com/AlpineArmoring/"
                target="_blank"
              >
                <FacebookIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_tiktok}`}
            >
              <Link
                href="https://www.tiktok.com/@alpinearmoring"
                target="_blank"
              >
                <TiktokIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_x}`}
            >
              <Link href="https://twitter.com/AlpineArmoring" target="_blank">
                <XIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.instagram.com/alpinearmoring/"
                target="_blank"
              >
                <InstagramIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.youtube.com/c/AlpineArmoring"
                target="_blank"
              >
                <YoutubeIcon color="white" />
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.navigationPopup_bottom} mobile-only`}>
          <SearchIcon className={`${styles.navigationPopup_bottom_search}`} />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default NavigationPopup;
