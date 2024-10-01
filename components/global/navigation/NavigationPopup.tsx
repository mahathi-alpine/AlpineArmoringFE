import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationProps } from 'types';
import styles from './NavigationPopup.module.scss';
import dynamic from 'next/dynamic';

import ArrowIcon from 'components/icons/Arrow';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import MailIcon from 'components/icons/Mail';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
const LanguageSwitcher = dynamic(
  () => import('components/global/lang-switcher/LangSwitcher')
);

const NavigationPopup = ({ isNavOpen, setNavOpen }: NavigationProps) => {
  const router = useRouter();
  const [activeSubmenu, setActiveSubmenu] = useState<
    { text: string; path: string }[] | null
  >(null);

  const links = [
    { path: '/available-now', text: 'Available Now' },
    {
      text: 'Vehicles We Armor',
      submenu: [
        {
          text: 'SUVs',
          path: '/vehicles-we-armor/type/armored-suvs',
        },
        {
          text: 'Sedans',
          path: '/vehicles-we-armor/type/armored-sedans',
        },
        {
          text: 'Pickup Trucks',
          path: '/vehicles-we-armor/type/armored-pickup-trucks',
        },
        {
          text: 'Law Enforcement',
          path: '/vehicles-we-armor/type/armored-law-enforcement',
        },
        {
          text: 'Cash-In-Transit (CIT)',
          path: '/vehicles-we-armor/type/armored-cash-in-transit-cit',
        },
        {
          text: 'Specialty Vehicles',
          path: '/vehicles-we-armor/type/armored-specialty-vehicles',
        },
      ],
    },
    { path: '/ballistic-testing', text: 'Ballistic Testing' },
  ];

  const linksRight = [
    { path: '/about-us', text: 'About Us' },
    { path: '/ballistic-chart', text: 'Ballistic Chart' },
    { path: '/news', text: 'All News' },
    { path: '/media', text: 'Videos & Trade Shows' },
    { path: '/available-now/type/armored-rental', text: 'Rental vehicles' },
    { path: '/design-and-engineering', text: 'Design & Engineering' },
    { path: '/manufacturing', text: 'Manufacturing' },
    { path: '/shipping-and-logistics', text: 'Shipping & Logistics' },
    { path: '/become-a-dealer', text: 'Become a Dealer' },
    { path: '/faqs', text: 'FAQ' },
    { path: '/contact', text: 'Contact' },
  ];

  const showSubmenu = (
    submenu: { text: string; path: string }[] | undefined
  ) => {
    if (submenu) {
      setActiveSubmenu(submenu);
    } else {
      setActiveSubmenu(null);
    }
  };

  const closeNavAndSubmenu = () => {
    setNavOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    if (!isNavOpen) {
      setActiveSubmenu(null);
    }
  }, [isNavOpen]);

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  return (
    <nav
      className={`${styles.navigationPopup} ${
        isNavOpen ? styles.navigationPopup_open : ''
      }`}
      id="navigationPopup"
    >
      <div className={`${styles.navigationPopup_inner} container`}>
        <div className={`${styles.navigationPopup_nav}`}>
          {!activeSubmenu && (
            <>
              <ul
                className={`${styles.navigationPopup_list_left} ${styles.navigationPopup_list}`}
              >
                {links.map((link, index) => (
                  <li
                    key={index}
                    className={`
                      ${styles.navigationPopup_item} 
                      ${
                        router.asPath === link.path
                          ? `${styles.navigationPopup_item_active}`
                          : ''
                      }`}
                    onClick={() =>
                      link.path ? setNavOpen(false) : showSubmenu(link.submenu)
                    }
                  >
                    {link.path ? (
                      <Link
                        className={`${styles.navigationPopup_link}`}
                        href={link.path}
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <span className={`${styles.navigationPopup_link}`}>
                        {link.text}
                      </span>
                    )}
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
                        router.asPath === link.path
                          ? `${styles.navigationPopup_item_active}`
                          : ''
                      }`}
                    onClick={closeNavAndSubmenu}
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
            </>
          )}

          {activeSubmenu && (
            <ul className={`${styles.navigationPopup_submenu}`}>
              <div
                className={`${styles.navigationPopup_submenu_back}`}
                onClick={handleBackClick}
              >
                <ArrowIcon />
              </div>
              {activeSubmenu.map((item, index) => (
                <li
                  key={index}
                  className={`
                    ${styles.navigationPopup_item} 
                    ${
                      router.asPath === item.path
                        ? `${styles.navigationPopup_item_active}`
                        : ''
                    }`}
                >
                  <Link
                    href={item.path}
                    className={`${styles.navigationPopup_link}`}
                    onClick={closeNavAndSubmenu}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
              Sales@AlpineCo.com
            </Link>

            <div className={`${styles.navigationPopup_contact_item}`}>
              <MapIcon />
              Chantilly, Virginia, USA
            </div>
          </div>

          <ul className={`${styles.navigationPopup_socials}`}>
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.youtube.com/c/AlpineArmoring"
                target="_blank"
              >
                <YoutubeIcon color="white" />
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
            <li
              className={`${styles.navigationPopup_socials_item} ${styles.navigationPopup_socials_item_x}`}
            >
              <Link href="https://x.com/AlpineArmoring" target="_blank">
                <XIcon color="white" />
              </Link>
            </li>
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
            <li className={`${styles.navigationPopup_socials_item}`}>
              <Link
                href="https://www.linkedin.com/company/alpinearmoring/"
                target="_blank"
              >
                <LinkedinIcon color="white" />
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.navigationPopup_bottom} mobile-only`}>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default NavigationPopup;
